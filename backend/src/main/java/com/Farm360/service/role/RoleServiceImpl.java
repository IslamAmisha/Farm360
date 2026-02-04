package com.Farm360.service.role;

import com.Farm360.dto.request.RoleRQ;

import com.Farm360.dto.response.RoleRS;

import com.Farm360.model.UserEntity;
import com.Farm360.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoleServiceImpl implements RoleService{

    @Autowired
    private UserRepo userRepo;

    @Override
    public RoleRS updateRole(Long userId, RoleRQ rq) {

        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRole(rq.getRole());
        userRepo.save(user);

        RoleRS rs = new RoleRS();
        rs.setUserId(user.getId());
        rs.setRole(user.getRole());
        rs.setStatus("ROLE_ASSIGNED");

        return rs;
    }
}
