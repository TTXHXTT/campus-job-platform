package com.scm.springboot.entity;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class Salary {
    private Integer id;
    private Integer jobId;
    private Integer studentId;
    private BigDecimal amount;
    private Integer status;
    private String createTime;
    
    // 非数据库字段
    private String jobTitle;
    private String studentName;
} 