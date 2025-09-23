package com.scm.springboot.entity;

import lombok.Data;

@Data
public class User {
    private Integer id;
    private String username;
    private String password;
    private Integer type;
    private String name;
    private String phone;
    private String avatar;
    private Integer status;
    private String createTime;
} 