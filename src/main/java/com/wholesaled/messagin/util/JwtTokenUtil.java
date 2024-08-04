package com.wholesaled.messagin.util;

import java.io.Serializable;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;


@Component
public class JwtTokenUtil implements Serializable {
	@Value("${jwt.secret}")
	private String secretKey;
	private String payloadJson;

	private static final long serialVersionUID = -2550185165626007488L;
	private     Logger logger = LoggerFactory.getLogger(JwtTokenUtil.class);


	public DecodedJWT decode(String token) {
		//    return JWT.require(Algorithm.HMAC256(secretKey))
		logger.info("token : " + token);
		try {
		  DecodedJWT jwt = JWT.require(Algorithm.HMAC256(secretKey))
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
	}}}
	
	
	
	
		

