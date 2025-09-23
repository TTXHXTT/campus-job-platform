package com.scm.springboot.entity;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class Job {
    private Integer id;
    private Integer publisherId;
    private String title;
    private String content;
    private BigDecimal salary;
    private String address;
    private String requirement;
    private Integer status;
    private String createTime;
    
    // 非数据库字段
    private String publisherName;
} 