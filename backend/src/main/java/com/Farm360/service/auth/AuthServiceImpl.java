package com.Farm360.service.auth;

import com.Farm360.dto.request.LoginRQ;
import com.Farm360.dto.request.OtpSendRQ;
import com.Farm360.dto.request.OtpVerifyRQ;
import com.Farm360.dto.response.LoginRS;
import com.Farm360.dto.response.OtpSendRS;
import com.Farm360.dto.response.OtpVerifyRS;
import com.Farm360.model.UserEntity;
import com.Farm360.repository.UserRepo;
import com.Farm360.security.jwt.JwtUtils;
import com.Farm360.service.escrow.WalletBootstrapService;
import com.Farm360.utils.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepo userRepo;
    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private WalletBootstrapService walletBootstrapService;

    private final RestTemplate rest = new RestTemplate();

    @Value("${otp.api.key}")
    private String apiKey;

    private final Map<String, String> captchaStore = new HashMap<>();


    @Override
    public OtpSendRS sendOtp(OtpSendRQ rq) {

        String url = "https://2factor.in/API/V1/" + apiKey + "/SMS/" + rq.getPhone() + "/AUTOGEN";
        Map resp = rest.getForObject(url, Map.class);

        OtpSendRS rs = new OtpSendRS();
        rs.setStatus((String) resp.get("Status"));
        rs.setSessionId((String) resp.get("Details"));
        return rs;

    }

    @Override
    public OtpVerifyRS verifyOtp(OtpVerifyRQ rq) {

        String url = "https://2factor.in/API/V1/" + apiKey +
                "/SMS/VERIFY/" + rq.getSessionId() + "/" + rq.getOtp();

        Map resp = rest.getForObject(url, Map.class);

        OtpVerifyRS rs = new OtpVerifyRS();
        String status = (String) resp.get("Status");

        rs.setVerified("Success".equalsIgnoreCase(status));
        if (!rs.isVerified())
            return rs;

        // Check existing user
        UserEntity existing = userRepo.findByPhoneNumber(rq.getPhone()).orElse(null);

        if (existing != null) {
            rs.setAlreadyRegistered(true);
            rs.setUserId(existing.getId());
            rs.setRole(existing.getRole());

            if (existing.getRole() != Role.pending) {
                rs.setJwt(jwtUtils.generateJwt(existing.getPhoneNumber(), existing.getRole()));
            }

            return rs;
        }

        // Create new user with PENDING role
        UserEntity user = new UserEntity();
        user.setPhoneNumber(rq.getPhone());
        user.setRole(Role.pending);
        userRepo.save(user);

        rs.setAlreadyRegistered(false);
        rs.setUserId(user.getId());
        rs.setRole(Role.pending);

        return rs;
    }

    @Override
    public LoginRS login(LoginRQ rq) {

        // Validate captcha
        String realCaptcha = captchaStore.get(rq.getPhoneNumber());
        if (realCaptcha == null || !realCaptcha.equals(rq.getCaptcha())) {
            throw new RuntimeException("Invalid Captcha");
        }

        // Find user by phone
        UserEntity user = userRepo.findByPhoneNumber(rq.getPhoneNumber())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == Role.buyer) {
            walletBootstrapService.ensureBuyerWallet(user.getId());
        }
        if (user.getRole() == Role.farmer) {
            walletBootstrapService.ensureFarmerWallet(user.getId());
        }

        // Generate token
        String token = jwtUtils.generateJwt(user.getPhoneNumber(), user.getRole());

        return new LoginRS(user.getId(), token, user.getRole().name());
    }

    public void saveCaptcha(String phone, String captcha){
        captchaStore.put(phone, captcha);
    }

}
