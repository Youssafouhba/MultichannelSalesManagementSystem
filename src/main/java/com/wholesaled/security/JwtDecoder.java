package com.wholesaled.security;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtDecoder {
  //  private final JwtProperties properties;
  private final JwtProperties properties;
    Logger logger = LoggerFactory.getLogger(JwtDecoder.class);

    public DecodedJWT decode(String token) {
    //    return JWT.require(Algorithm.HMAC256(properties.getSecretKey()))
    logger.info("token : " + token+"Secret Key : "+properties.getSecretKey());
    try {
      DecodedJWT jwt = JWT.require(Algorithm.HMAC256(properties.getSecretKey()))
      .build()
      .verify(token);
      return jwt;
}     catch (JWTVerificationException exception) {
  logger.error("Failed to decode JWT token: {}", exception.getMessage());
  logger.debug("Token: {}", token);
  logger.debug("Exception: ", exception);
  throw new JWTVerificationException("Invalid JWT token", exception);
} catch (IllegalArgumentException exception) {
  logger.error("Invalid secret key: {}", exception.getMessage());
  throw new IllegalArgumentException("Invalid secret key configuration", exception);
}




    }
}