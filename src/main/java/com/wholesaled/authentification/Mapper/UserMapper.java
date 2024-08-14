package com.wholesaled.authentification.Mapper;


import org.springframework.stereotype.Component;

import com.wholesaled.authentification.dto.UserDto;
import com.wholesaled.authentification.model.User;

@Component
public class UserMapper {
    public UserDto toDto(User entity) {
        return UserDto.builder()
                .id(entity.getId())
                .fullName(entity.getFullName()) // Changed from username to fullName to match the UserDto class.
                .password(entity.getPassword())
                .email(entity.getEmail())
                .type(entity.getRole())
                .build();
    }

    public User toEntity(UserDto dto) {
        return User.builder()
                .id(dto.getId())
                .fullName(dto.getFullName())
                .password(dto.getPassword())
                .email(dto.getEmail())
                .role(dto.getType())
                .build();
    }

}
