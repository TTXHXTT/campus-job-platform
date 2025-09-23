package com.scm.springboot.entity;

import lombok.Data;

@Data
public class Ueditor {
    private String state;
    private String url;
    private String title;
    private String original;
    
    public Ueditor() {
        this.state = "";
        this.url = "";
        this.title = "";
        this.original = "";
    }
    
    public Ueditor(String state, String url, String title, String original) {
        this.state = state;
        this.url = url;
        this.title = title;
        this.original = original;
    }
} 