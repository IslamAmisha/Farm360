package com.Farm360.model.audit;

import com.Farm360.security.UserDetailsImpl;
import org.apache.tomcat.util.http.parser.Authorization;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

public class AuditAwareImpl implements AuditorAware<String> {
    @Override
    public Optional<String> getCurrentAuditor() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if(authentication!=null && authentication.isAuthenticated())
        {
            Object principal = authentication.getPrincipal();
            if(principal instanceof UserDetailsImpl)
            {
                UserDetailsImpl userDetailsImpl= (UserDetailsImpl) principal;
                return Optional.of(String.valueOf(userDetailsImpl.getId()));
            }
            else if(principal instanceof UserDetails)
            {
                UserDetails userDetails = (UserDetails) principal;
                return Optional.ofNullable(userDetails.getUsername());
            }
            else if (principal instanceof  String) {
                return Optional.of((String) principal);
            }
        }

        return Optional.of("System Generated");
    }
}
