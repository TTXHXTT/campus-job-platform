package com.scm.springboot.entity;

import lombok.Data;

@Data
public class PublicMsg {
    private String msg;
    private Integer code;
    private Object data;
    
    public static final String UEDITOR_CONFIG = "{\n" +
        "    \"imageActionName\": \"uploadimage\",\n" +
        "    \"imageFieldName\": \"upfile\",\n" +
        "    \"imageMaxSize\": 2048000,\n" +
        "    \"imageAllowFiles\": [\".png\", \".jpg\", \".jpeg\", \".gif\", \".bmp\"],\n" +
        "    \"imageCompressEnable\": true,\n" +
        "    \"imageCompressBorder\": 1600,\n" +
        "    \"imageInsertAlign\": \"none\",\n" +
        "    \"imageUrlPrefix\": \"\",\n" +
        "    \"imagePathFormat\": \"/ueditor/jsp/upload/image/{yyyy}{mm}{dd}/{time}{rand:6}\"\n" +
        "}";
    
    public PublicMsg(Integer code, String msg) {
        this.code = code;
        this.msg = msg;
    }
    
    public PublicMsg(Integer code, String msg, Object data) {
        this.code = code;
        this.msg = msg;
        this.data = data;
    }
} 