package com.scm.springboot.view;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class Admin {

    @GetMapping("/")
    public String login() {
        return "admin/login";
    }

    @GetMapping("/admin/index")
    public String index() {
        return "admin/index";
    }

    @GetMapping("/admin/user")
    public String user() {
        return "admin/user";
    }

    @GetMapping("/admin/notice")
    public String notice() {
        return "admin/notice";
    }

    @GetMapping("/admin/job")
    public String job() {
        return "admin/job";
    }

    @GetMapping("/admin/apply")
    public String apply() {
        return "admin/apply";
    }

    @GetMapping("/admin/salary")
    public String salary() {
        return "admin/salary";
    }

    @GetMapping("/admin/news")
    public String news() {
        return "admin/news";
    }

    @GetMapping("/admin/activity")
    public String activity() {
        return "admin/activity";
    }

    @GetMapping("/admin/forum")
    public String forum() {
        return "admin/forum";
    }

    @GetMapping("/admin/post")
    public String post() {
        return "admin/post";
    }

    @GetMapping("/admin/comment")
    public String comment() {
        return "admin/comment";
    }

    @GetMapping("/admin/goods")
    public String goods() {
        return "admin/goods";
    }

}
