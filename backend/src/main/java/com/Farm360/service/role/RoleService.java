package com.Farm360.service.role;

import com.Farm360.dto.request.RoleRQ;
import com.Farm360.dto.response.RoleRS;

public interface RoleService {
    RoleRS updateRole(Long userId, RoleRQ rq);
}
