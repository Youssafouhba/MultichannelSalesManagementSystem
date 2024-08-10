package com.wholesaled.authentification.dto;


import com.wholesaled.authentification.util.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

        private Long id;
        private String fullName;
        private String email;
        private String password;
        private Role type;


        // Getters and setters


    }
