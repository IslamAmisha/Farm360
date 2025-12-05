package com.Farm360.service.auth;

import com.Farm360.dto.request.LoginRQ;
import com.Farm360.dto.request.OtpSendRQ;
import com.Farm360.dto.request.OtpVerifyRQ;
import com.Farm360.dto.response.LoginRS;
import com.Farm360.dto.response.OtpSendRS;
import com.Farm360.dto.response.OtpVerifyRS;

public interface AuthService {

    OtpSendRS sendOtp(OtpSendRQ rq);

    OtpVerifyRS verifyOtp(OtpVerifyRQ rq);

    LoginRS login(LoginRQ rq);

    void saveCaptcha(String phone, String captcha);
}
