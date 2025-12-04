package com.Farm360.controller;

import com.Farm360.dto.request.RoleRQ;
import com.Farm360.dto.response.RoleRS;
import com.Farm360.service.role.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/role")
public class RoleController {

    @Autowired
    private RoleService userRoleService;

    @PutMapping("/{userId}/role")
    public ResponseEntity<RoleRS> updateRole(
            @PathVariable Long userId,
            @RequestBody RoleRQ rq
    ) {
        return ResponseEntity.ok(userRoleService.updateRole(userId, rq));
    }
}
