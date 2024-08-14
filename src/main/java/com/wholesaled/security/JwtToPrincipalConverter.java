package com.wholesaled.security;

import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import com.auth0.jwt.interfaces.DecodedJWT;

@Component
public class JwtToPrincipalConverter {
    public UserPrincipal convert(DecodedJWT jwt) {
        
        var authorityList = getClaimOrEmptyList(jwt, "role").stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                .toList();
        

        return UserPrincipal.builder()
                .userId( jwt.getClaim("userid").asLong() )
                .email( jwt.getClaim("email").asString() )
                .authorities( authorityList )
                .build();
    }

    private List<String> getClaimOrEmptyList(DecodedJWT jwt, String claim) {
        if (jwt.getClaim(claim).isNull()) return List.of();
        return jwt.getClaim(claim).asList(String.class);
    }
}