package com.scm.springboot.entity;

import lombok.Data;

@Data
public class Checkin {
    private Integer id;
    private Integer jobId;
    private Integer studentId;
    private String checkinTime;
    private String checkoutTime;
    private String createTime;
    
    // 非数据库字段
    private String jobTitle;
    private String studentName;
} 