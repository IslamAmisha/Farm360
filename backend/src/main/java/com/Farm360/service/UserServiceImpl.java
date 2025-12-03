package com.Farm360.service;

import com.Farm360.dto.request.BuyerRegisterRQ;
import com.Farm360.dto.request.FarmerRegisterRQ;
import com.Farm360.dto.request.UserRQ;
import com.Farm360.dto.response.BuyerRS;
import com.Farm360.dto.response.FarmerRS;
import com.Farm360.dto.response.UserRS;
import com.Farm360.mapper.BuyerMapper;
import com.Farm360.mapper.FarmerMapper;
import com.Farm360.mapper.UserMapper;
import com.Farm360.model.BuyerEntity;
import com.Farm360.model.FarmerEntity;
import com.Farm360.model.UserEntity;
import com.Farm360.repository.BuyerRepo;
import com.Farm360.repository.FarmerRepo;
import com.Farm360.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private UserMapper userMapper;


    @Override
    public UserRS createUser(UserRQ rq) {

        if (userRepo.existsByPhoneNumber(rq.getPhoneNumber())) {
            throw new RuntimeException("Phone number already registered");
        }

        UserEntity entity = userMapper.mapToEntity(rq);

        UserEntity saved = userRepo.save(entity);

        return userMapper.mapEntityToRS(saved);
    }


    @Override
    public UserRS getUserById(Long id) {

        UserEntity user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return userMapper.mapEntityToRS(user);
    }
}
