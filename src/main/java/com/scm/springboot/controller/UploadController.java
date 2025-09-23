package com.scm.springboot.controller;

import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.scm.springboot.entity.PublicMsg;
import com.scm.springboot.entity.Ueditor;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;

@RestController
public class UploadController {
    @RequestMapping(value = "/ueditor")
    @ResponseBody
    public String ueditor(HttpServletRequest request) {

        return PublicMsg.UEDITOR_CONFIG;
    }

    @RequestMapping(value = "/imgUpload")
    @ResponseBody
    public Ueditor imgUpload(MultipartFile upfile) {
        Ueditor ueditor = new Ueditor();
        return ueditor;
    }

    @PostMapping("/upload")
    public Ueditor uplaod(HttpServletRequest req, @RequestParam("upfile") MultipartFile file) {
        Ueditor ueditor = new Ueditor();
        String fileName = "";
        String destFileName = "";
        // 1. 接受上传的文件 @RequestParam("file") MultipartFile file
        try {
            // 2.根据时间戳创建新的文件名，这样即便是第二次上传相同名称的文件，也不会把第一次的文件覆盖了
            fileName = System.currentTimeMillis() + file.getOriginalFilename();
            // 3.通过req.getServletContext().getRealPath("") 获取当前项目的真实路径，然后拼接前面的文件名
            destFileName = ResourceUtils.getURL("classpath:").getPath() + "static/upload" + File.separator + fileName;
            // 4.第一次运行的时候，这个文件所在的目录往往是不存在的，这里需要创建一下目录（创建到了webapp下uploaded文件夹下）
            File destFile = new File(destFileName);
            destFile.getParentFile().mkdirs();
            // 5.把浏览器上传的文件复制到希望的位置
            file.transferTo(destFile);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
            ueditor.setState("上传失败");
            ueditor.setOriginal("");
            ueditor.setUrl("");
            return ueditor;

        } catch (IOException e) {
            e.printStackTrace();
            ueditor.setState("上传失败");
            ueditor.setOriginal("");
            ueditor.setUrl("");
            return ueditor;
        }
        ueditor.setState("SUCCESS");
        ueditor.setOriginal(fileName);
        ueditor.setUrl("/static/upload/" + fileName);
        ueditor.setTitle(fileName);
        return ueditor;
    }
}
