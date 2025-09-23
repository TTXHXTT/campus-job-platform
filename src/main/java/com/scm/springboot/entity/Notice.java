package com.scm.springboot.entity;

import lombok.Data;

@Data
public class Notice {
    private Integer id;
    private String title;
    private String content;
    private String image;
    private String createTime;
} 