package com.wholesaled.messagin.payloads;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private String Fullname;
    private String email;
    private List<String> roles;
}
