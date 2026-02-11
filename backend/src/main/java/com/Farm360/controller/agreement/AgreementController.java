package com.Farm360.controller.agreement;

import com.Farm360.dto.request.agreement.AgreementCreateRQ;
import com.Farm360.dto.response.agreement.AgreementListRS;
import com.Farm360.dto.response.agreement.AgreementRS;
import com.Farm360.security.UserDetailsImpl;
import com.Farm360.service.agreement.AgreementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agreements")
public class AgreementController {

    @Autowired
    private AgreementService agreementService;

    @PostMapping("/create")
    public ResponseEntity<AgreementRS> createAgreement(
            @RequestBody AgreementCreateRQ rq,
            Authentication authentication
    ) {
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
        rq.setUserId(user.getId());

        return ResponseEntity.ok(
                agreementService.createAgreement(rq)
        );
    }


    @GetMapping("/{agreementId}")
    public ResponseEntity<AgreementRS> getAgreement(
            @PathVariable Long agreementId,
            Authentication authentication
    ) {
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();

        return ResponseEntity.ok(
                agreementService.getAgreement(agreementId, user.getId())
        );
    }

    @GetMapping("/my/agreement")
    public ResponseEntity<List<AgreementListRS>> myAgreements(
            Authentication authentication
    ) {
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();

        return ResponseEntity.ok(
                agreementService.getMyAgreements(user.getId())
        );
    }
}
