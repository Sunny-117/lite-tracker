# SpringMVC 应用

## 1. 三层架构

**服务器端程序，一般都基于两种形式，一种 C/S 架构程序，一种 B/S 架构程序. 使用 Java 语言基本上都是开发 B/S 架构的程序，B/S 架构又分成了三层架构**

- 三层架构

  ​ 表现层：WEB 层，用来和客户端进行数据交互的。表现层一般会采用 MVC 的设计模型

  ​ 业务层：处理公司具体的业务逻辑的

  ​ 持久层：用来操作数据库的

- MVC 全名是 Model View Controller 模型视图控制器，每个部分各司其职。

  ​ Model：数据模型，JavaBean 的类，用来进行数据封装。

  ​ View：指 JSP、HTML 用来展示数据给用户

  ​ Controller：用来接收用户的请求，整个流程的控制器。用来进行数据校验等(Hibernate Validator)

## 2. SpringMVC 介绍

### 概述

- SpringMVC 是一种基于 Java 的、实现 MVC 设计模型的、请求驱动类型的(基于 HTTP 协议)、轻量级 Web 框架，属于 Spring FrameWork 的后续产品。Spring 框架提供了构建 Web 应用程序的全功能 MVC 模块。
- SpringMVC 已经成为目前最主流的 MVC 框架之一，并且随着 Spring3.0 的发布，全面超越 Struts2，成为最优秀的 MVC(web 层的) 框架。
- 它通过一套注解，让一个简单的 Java 类成为处理请求的控制器（Controller），而无须实现任何接口（跟 Servlet 对比）。同时它还支持 RESTful 编程风格的请求。

### SpringMVC 的优点

1. 清晰的角色划分：
   - 前端控制器（DispatcherServlet）
   - 请求到处理器映射（HandlerMapping） ：负责找 controller 类
   - 处理器适配器（HandlerAdapter） ： 负责调用 controller 类，得到结果，封装结果
   - 视图解析器（ViewResolver） ： 负责解析 view
   - 处理器或页面控制器（Controller）
   - 验证器（ Validator）
   - 命令对象（Command 请求参数绑定到的对象就叫命令对象）
   - 表单对象（Form Object 提供给表单展示和提交到的对象就叫表单对象）。
2. 分工明确，而且扩展点相当灵活，可以很容易扩展，虽然几乎不需要。
3. 由于命令对象就是一个 POJO， 无需继承框架特定 API，可以使用命令对象直接作为业务对象。
4. 和 Spring 其他框架无缝集成，是其它 Web 框架所不具备的。
5. 可适配，通过 HandlerAdapter 可以支持任意的类作为处理器。
6. 可定制性， HandlerMapping、 ViewResolver 等能够非常简单的定制。
7. 功能强大的数据验证、格式化、绑定机制。
8. 利用 Spring 提供的 Mock 对象能够非常简单的进行 Web 层单元测试。
9. 本地化、主题的解析的支持，使我们更容易进行国际化和主题的切换。
10. 强大的 JSP 标签库，使 JSP 编写更容易。
11. 其他，比如 RESTful 风格的支持、简单的文件上传、约定大于配置的契约式编程支持、基于注解的零配置支持等等。

## 3. SpringMVC 快速入门

### 1.需求

浏览器请求服务器(SpringMVC), 响应成功页面

### 2. 分析

1. 创建 maven 工程，导入依赖
2. 创建 Controller, 处理的请求
3. 创建一个 index.jsp 页面, success.jsp
4. 配置 springmvc.xml
5. 配置 web.xml 启动时加载 springmvc.xml 【配置 DispatcherServlet】

### 3. 实现

#### 3.1 导入依赖

```xml
<dependencies>
    <!--springmvc-->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId>
        <version>5.1.2.RELEASE</version>
    </dependency>
    <!--jsp-api-->
    <dependency>
        <groupId>javax.servlet.jsp</groupId>
        <artifactId>javax.servlet.jsp-api</artifactId>
        <version>2.3.1</version>
        <scope>provided</scope>
    </dependency>
    <!--servlet-api-->
    <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>javax.servlet-api</artifactId>
        <version>3.1.0</version>
        <scope>provided</scope>
    </dependency>
</dependencies>
```

#### 3.2 编写页面

在 webapp 里创建`success.jsp`

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
  <head>
    <title>Title</title>
  </head>
  <body>
    <h2>这是成功的页面~</h2>
  </body>
</html>
```

#### 3.3 创建 Controller

- 在`com.zwh.controller`包中创建类`Controller01`
- 类上增加`@Controller`注解，声明成为一个 bean
- 创建`sayHi方法`，并在方法上增加`@RequestMapping`注解，声明方法的访问路径

```java
package com.zwh.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/*
    入门案例
        1. 定义类，类上打注解 @Controller
        2. 定义方法， 方法上打注解 @RequestMapping
        3. 这个controller能处理 /sayHi的请求，但是要想处理请求，首先必须能抓住请求。
        4. 所以要在web.xml配置servlet: DispatcherServlet
 */
@Controller
public class Controller01 {
    @RequestMapping("/sayHi")
    public String sayHi(){
        System.out.println("调用了Controller01的sayHi方法~");
        return "/success.jsp";
    }
}
```

#### 3.4 编写配置文件

在`resources`中创建 springmvc 的配置文件`springmvc.xml` , 这个名字可以随意写。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd http://www.springframework.org/schema/mvc http://www.springframework.org/schema/mvc/spring-mvc.xsd">

    <!-- 1.扫描包 -->
    <context:component-scan base-package="com.zwh"/>

    <mvc:annotation-driven/>

</beans>
```

#### 3.5 修改 Web.xml

在`webapp/WEB-INF/web.xml`中配置前端控制器`DispatcherServlet`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns="http://java.sun.com/xml/ns/javaee"
	xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd"
	version="2.5">

	<!--配置DispatcherServlet  【SpringMVC核心控制器】-->
	<!--SpringMVC中唯一的一个Servlet，配置请求访问路径为/，负责接收客户端所有的请求 交给Controller中的方法处理-->
	<servlet>
		<!--servlet名称-->
		<servlet-name>springmvc</servlet-name>
		<!--servlet全限定类名-->
		<servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
		<!--servlet初始化参数  创建DispatcherServlet对象时要进行加载SpringMVC的核心配置文件-->
		<init-param>
			<param-name>contextConfigLocation</param-name>
			<param-value>classpath:springmvc.xml</param-value>
		</init-param>
		<!--Servlet启动项配置  参数越小 优先级越高  希望DispatcherServlet在服务器启动时完成实例化以及初始化工作-->
		<load-on-startup>1</load-on-startup>
	</servlet>

	<!--
		问题：DispatcherServlet的请求映射路径为什么配置为/？能不能配置为/* 、 *.do
		解释：
			1.可以配置为*.do 但是这样每次请求都需要携带.do  比较麻烦 不推荐
			2.不能配置为/*
				因为配置为/* 的时候，访问jsp页面在浏览器显示的是源码 并不是执行的结果
				因为在tomcat中提供的有一个专门处理JSP请求的Servlet 叫JspServlet  它的请求映射路径配置的为*.jsp
				而/*【目录匹配】 的优先级高于 *.jsp【后缀名匹配】 导致tomcat中原有的JspServlet不工作了
			3.因此DispatcherServlet的请求映射路径最好配置为/
				Servlet优先级：完全路径匹配>目录匹配>/*>后缀名匹配>/【缺省 默认的】
	-->

	<!--Servlet请求映射路径配置-->
	<servlet-mapping>
		<servlet-name>springmvc</servlet-name>
		<url-pattern>/</url-pattern>
	</servlet-mapping>
</web-app>
```

#### 3.6 运行测试

- 启动项目，浏览器输入`http://localhost/sayHi`访问 Controller
- `sayHi`方法被访问到，并且页面跳转到了`success.jsp`

### 4. 小结

1. 创建 web 工程，导入依赖：`spring-webmvc, servlet-api, jsp-api`
2. 编写 Controller
3. 提供 springmvc.xml：开启组件扫描
4. 修改 web.xml：配置前端控制器 DispatcherServlet

## 4. SpringMVC 配置

### 1. 原理分析

#### 1.1 请求响应流程

![1564227187917](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/04-21-5r8Kme.png)

#### 1.2 三大组件

- `HandlerMapping`处理器映射器
  - 作用：根据客户端请求的资源路径，查找匹配的`Controller`及拦截器（类似过滤器）链
- `HandlerAdapter`处理器适配器
  - 作用：用于适配调用不同的`Controller` 执行 Controller，得到模型和视图
- `ViewResolver`视图解析器
  - 作用：用于解析视图，根据视图路径找到真实视图（页面）

#### 1.3 详细执行流程

1. 客户端发请求到`DispatcherServlet`
2. `DispatcherServlet`
   1. 通过`HandlerMapping`处理器映射器，根据请求路径，查找匹配的`Controller`及拦截器
   2. 得到要执行的`Controller`和拦截器（执行链）
3. `DispatcherServlet`
   1. 通过`HandlerAdapter`处理器适配器，调用控制器`Controller`
   2. 得到`ModelAndView`对象（其中 View 指视图路径，Model 要响应的数据对象）
4. `DispatcherServlet`
   1. 通过`ViewResolver`解析视图，得到真实视图（视图路径对应的页面）
   2. 渲染视图（把 Model 里的数据填充到 View 里 , 替换页面上的 EL 表达式为真实的数据）
5. 把最终渲染的结果，响应到客户端

### 2.springmvc.xml 配置

#### 2.1 注解驱动支持

```xml
<!--
    开启MVC注解驱动支持
       1 这个标签会帮助我们在项目里面导入SpringMVC三大组件   【XML配置时 不开启也会自动导入SpringMVC三大组件】
       2 后面用到的一些注解，必须要有这个标签的支撑，否则注解用不了！ eg：@RequestBody  @ResponseBody ...
-->
<mvc:annotation-driven/>
```

#### 2.2 视图解析器

- 物理视图：/success.jsp | success.jsp，即：视图的真实路径（完整路径）
  直观，但是写起来麻烦
- 逻辑视图：success，需要配合视图解析器，才能得到真实路径
  不直观，但是写起来简单

```java
//物理视图
@RequestMapping("/sayHi")
public String sayHi(){
    System.out.println("Hi sayHi");
    return "/success.jsp";
}

//逻辑视图
@RequestMapping("/sayHi02")
public String sayHi02(){
    System.out.println("Hi sayHi02");
    return "success";
}
```

```xml
<!--
    配置视图解析器
        1 视图解析器是搭配逻辑视图使用的，它要和方法的返回值拼接起来得到页面的真实路径
            前缀  +  方法的返回值  +  后缀    ====   eg：/success.jsp
        2 视图解析器一旦配置，就会对全局产生影响，所有的controller的方法返回值都要受到它的影响
            除了某些方法之外
        注意：
            1.当配置了视图解析器后，物理视图也会受到影响 导致解析不正常 出现访问404
            2.当项目中既要响应jsp页面 又要响应html页面 此时解决方式一种使用带前缀的物理视图，一种使用逻辑视图
            3.SpringMVC几乎不会直接响应视图给前端  一般都是响应json格式数据
-->
<bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
    <property name="prefix" value="/"/>
    <property name="suffix" value=".jsp"/>
</bean>
```

#### 2.3 web.xml 配置静态资源处理

Servlet 优先级：`完全路径匹配` > `目录匹配 /*` > `后缀名匹配 *.do` > `/`

在 tomcat 中有一个默认的 Servlet 负责处理静态资源，它的请求映射路径配置的也是`/`，而现在 DispatcherServlet 配置的 `/`将 tomcat 中提供的默认 Servlet 覆盖了，所以如果不做任何配置，用户不能直接访问 webapp 目录下的静态资源。
DispatcherServlet 会把这个静态资源请求当做动态资源请求，找不到对应的 Controller 处理，访问时就出现 404 找不到。

解法方法：

1. DispatcherServlet 的请求映射路径设置为`*.do`。但每次发起请求时都需要携带一个.do 的尾巴，**不推荐**。
2. 在 SpringMVC 中配置对静态资源放行。增加一类静态资源就需要配置一次，**不推荐**。

```xml
<!--
  /html/*  只会去html目录找资源
  /html/** html目录及其子孙目录下找资源
-->
<mvc:resources mapping="/html/**" location="/html/"/>
<mvc:resources mapping="/css/**" location="/css/"/>
<mvc:resources mapping="/js/**" location="/js/"/>
```

3. 将静态资源的处理权利交还给 tomcat 提供的默认 servlet DefaultServlet。**推荐**。

```xml
<mvc:default-servlet-handler/>
```

### 3.Controller 配置

#### 3.1 Controller 注解:

- 表示这个类是一个控制器，可以处理请求。
- spring 会把这个类管理起来， 创建这个类的对象。

#### 3.2 Controller 工作原理：

- 项目启动时，SpringMVC 扫描所有带有@Controller 注解的类，接着扫描其中的方法
- 识别方法上的@RequestMapping 注解，将请求访问地址和对应的处理方法存入到一个 map 集合中
- 当有请求来了，HandlerMapping 就会去 Map 集合中根据请求地址找到对应的 Controller 中的方法处理请求

#### 3.3 RequestMapping

功能是设置请求映射地址，可以打在

- 打在方法上：设置当前方法要处理哪个请求

- 打在类上： 设置当前 Controller 中方法处理请求路径的前缀，模块名称，请求路径是模块名+方法名的拼接。`/user/reg`

- 属性：

  - value|path：访问路径，即：什么路径能够访问到这个方法。一个方法可以设置处理多个请求地址

  - method：请求方式，即：什么请求方式能够访问这个方法。

    如果不设置，默认任何方式的请求都可以进来，也可以设置多种请求方式。eg: `method = {RequestMethod.GET,RequestMethod.POST}`
    报错：HTTP Status 405 - Request method 'GET' not supported
    原因：方法定义时要求使用的请求方式 和用户实际发送请求使用的方式不一致
    解决：设置为一致

  - params：请求参数，即：请求携带了什么样的参数能够访问这个方法
    params = "username"：表示请求必须携带 username 参数
    params = "username=zwh"：表示请求必须携带 username 的参数，参数值必须为 zwh
    params = "username!=zwh"：表示请求必须携带 username 参数,参数值不能为 zwh
    报错：如果不携带参数 则会报错 400 Parameter conditions "username" not met for actual request parameters:
    原因：要求携带的请求参数 请求没有携带
    解决：携带参数

  - 总结：
    400：一定是请求参数错误！！！ 服务器要求的和你给的不一致
    403：
    404：一定是请求路径错误！！！
    405：一定是请求方式错误！！！ 方法要求的请求方式和用户实际发送请求的方式不一致
    406：

```java
//@RequestMapping({"/sayHi03","/sayHi3","/sh3"})
//@RequestMapping(value = "/sayHi03",method = {RequestMethod.GET, RequestMethod.POST})
@RequestMapping(value = "/sayHi03",params = {"username=zwh", "age=18"})
public String sayHi03(){
    System.out.println("Hi sayHi03");
    return "success";
}
```

## 5. 获取请求参数

- 支持的数据类型

  ​ 基本数据类型和字符串类型

  ​ 实体类型（JavaBean）

  ​ 集合数据类型（List、map 集合等）

- 使用要求

  - 如果是基本类型或者 String 类型： 要求我们的参数名称必须和 controller 中方法的形参名称保持一致。 (严格区分大小写) .

  - 如果是 对象 类型，或者它的关联对象： 要求表单中参数名称和对象类的属性名称保持一致

  - 如果是集合类型,有两种方式：
    - 第一种：要求集合类型的请求参数必须在对象类 中。在表单中请求参数名称要和 对象类中集合属性名称相同。给 List 集合中的元素赋值， 使用下标[]。给 Map 集合中的元素赋值， 使用键值对。
    - 第二种：**接收的请求参数是 json 格式数据。需要借助一个注解实现 @RequestBody**

### 1.获取普通请求参数

```java
/*
    1.获取普通请求参数。get 和 post 表单
    要求：请求参数名称要和方法参数名称一致，如果不一致，则无法接收
    注意：
        1.请求参数给多了 不接收而已
        2.请求参数给少了  方法参数赋值为null
        3.定义参数时 最好使用引用包装类型 如果没有参数传递，会赋值为null 如果是基本类型接收，则报错 提示无法完成数据类型转换
 */
@RequestMapping("/getParams01")
public String getParams01(String name, Integer age){
    System.out.println("==========获取普通请求参数=======");
    System.out.println("name = " + name);
    System.out.println("age = " + age);
    return "success";
}
```

**get 和 post 表单同样适用**

![image-20220421150140715](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/04-21-hxBgKz.png)

![image-20220421150100317](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/04-21-qCCQYH.png)

### 2.获取普通请求参数 - 请求参数名称和方法形参变量名不一致

```java
/*
    2.获取普通请求参数 - 请求参数名称和方法形参变量名不一致
    解决：使用@RequestParam注解：设置请求参数
        属性：
            name|value：用于设置请求参数名称
            required：当前这个参数是否是必须的  默认为true，请求必须携带该参数，不携带 则报错。设置为false，则可以不用携带该参数
            defaultValue：参数默认值
 */
@RequestMapping("/getParams02")
public String getParams02(@RequestParam(value = "name",required = false,defaultValue = "admin") String username, Integer age){
    System.out.println("==========获取普通请求参数=======");
    System.out.println("username = " + username);
    System.out.println("age = " + age);
    return "success";
}
```

### 3.获取 pojo 类型参数

```java
// javaBean
public class User implements Serializable {
    private String name;
    private Integer age;
    //getter,setter...
}
```

```java
/*
    3.获取pojo类型参数
        要求：请求参数名称要和java对象属性名称一致 就可以自动的将参数值封装到java对象的指定属性值中
        注意：
            1.当请求参数传递多的时候 实体类不接收而已  传递少的时候 对应的属性默认赋值为null
            2.获取请求参数 和请求方式无关 主要和请求参数名称有关
 */
@RequestMapping("/getParams03")
public String getParams03(User user){
    System.out.println("==========获取pojo类型参数=======");
    System.out.println("user = " + user);
    return "success";
}
```

![image-20220421151037476](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/04-21-tQGjYn.png)

### 4.获取嵌套 pojo 类型参数

```java
// javaBean
public class User02 implements Serializable {
    private String name;
    private Integer age;
    private Address address;
  //getter,setter
}
```

```java
/*
    4.获取嵌套pojo类型参数
        要求：普通属性名称和请求参数名称一致即可
             对象属性：要求对象.对象属性名称 和请求参数名称一致  eg：address.province
 */
@RequestMapping("/getParams04")
public String getParams04(User02 user){
    System.out.println("==========获取嵌套pojo类型参数=======");
    System.out.println("user = " + user);
    return "success";
}
```

<img src="https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/04-21-hRGnRG.png"  />

### 5.获取数组类型参数

```java
/*
    5.获取数组类型参数
        要求：请求参数名称和方法形参变量名一致，且请求参数有多个
 */
@RequestMapping("/getParams05")
public String getParams05(String[] hobby){
    System.out.println("==========获取数组类型参数=======");
    System.out.println("hobby = " + Arrays.toString(hobby));
    return "success";
}
```

![image-20220421161651759](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/04-21-wu5ZfL.png)

### 6.获取 List 集合类型参数

```java
/*
    6.获取 List集合类型参数
        要求：请求参数名称和方法形参变量名一致，且请求参数有多个
 */
@RequestMapping("/getParams06")
public String getParams06(@RequestParam List<String> hobby){
    System.out.println("==========获取集合类型参数=======");
    System.out.println("hobby = " + hobby);
    return "success";
}
```

![image-20220421161717495](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/04-21-D25Isu.png)

### 7.获取日期类型参数

```java
/*
    7.获取日期类型参数
        要求：请求参数名称和方法形参变量名或对象属性名称保持一致，
        注意：
            0.SpringMVC在接收请求参数时会自动完成类型转换，页面【参数都是String类型】 --> 后台【具体类型】
            1.SpringMVC默认只能将yyyy/MM/dd格式的日期字符串转为Date日期类型
            2.其他格式的日期字符串转为Date类型会报错 因为SpringMVC不认识，没有定义对应的类型转换器
        其他的字符串日期格式如何解决转换为Date日期类型
            1.自定义转换器，将自定义的转换器放入到SpringMVC中  进行全局解决
            2.使用SpringMVC提供的日期转换注解进行局部解决

 */
@RequestMapping("/getParams08")
public String getParams08(Date date1){
    System.out.println("==========获取日期类型参数=======");
    System.out.println("date1 = " + date1);
    return "success";
}
```

![image-20220421162143377](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/04-21-g1D2M8.png)

```java
@RequestMapping("/getParams09")
public String getParams09(@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date date2, @DateTimeFormat(pattern = "yyyy年MM月dd日") Date date3){
    System.out.println("==========获取日期类型参数=======");
    System.out.println("date2 = " + date2);
    System.out.println("date3 = " + date3);
    return "success";
}
```

![image-20220421163442765](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/04-21-hOvWre.png)

### 8.获取 json 格式请求参数

- 前端发起请求携带 json 格式请求参数
- 后台处理
  1：项目添加 jackson-databind 依赖坐标
  2：开启 MVC 注解驱动支持
  3：在方法形参前打上@RequestBody 注解。注意：同一方法只能使用一次

> 1.jackson-databind 依赖没有添加到项目中 会报 400 错误 请求参数有问题 2.方法形参变量前忘记添加@RequestBody 注解，请求正常，但没有将 json 格式参数封装到方法形参变量中

##### @RequestBody 注解

- 类型：形参注解
- 位置：SpringMVC 控制器方法形参定义前面
- 作用：将请求中请求体所包含的数据传递给请求参数，此注解一个处理器方法只能使用一次
- 区别
  @RequestParam 用于接收 url 地址传参，表单传参【application/x-www-form-urlencoded】
  @RequestBody 用于接收 json 数据【application/json】

```java
public class User03 implements Serializable {
    private String name;
    private Integer age;
    private Date birthday;
  	//getter && setter
}
```

```java
@RequestMapping("/getParams10")
public String getParams10(@RequestBody List<String> hobby){
    System.out.println("==========获取json普通数组格式参数=======");
    System.out.println("hobby = " + hobby);
    return "success";
}

// json = ["aa","bb","cc"]

@RequestMapping("/getParams11")
public String getParams11( User03 user){
    System.out.println("==========获取json对象格式参数=======");
    System.out.println("user = " + user);
    return "success";
}
// json = { "name":"张三", "age":21, "birthday":"2001-03-20" }

@RequestMapping("/getParams12")
public String getParams12(@RequestBody List<User03> list){
    System.out.println("==========获取json对象数组格式参数=======");
    System.out.println("list = " + list);
    return "success";
}

// json = [{ "name":"张三", "age":21, "birthday":"2001-03-20" },{ "name":"李四", "age":22, "birthday":"2001-03-20" }]
```

### 9.用 map 接受 json 格式参数

```java
@RequestMapping("/getParams11")
public String getParams11(@RequestBody Map<String, Integer> params){
    String phone = params.get("name");
    Integer code = params.get("age");
    return "success";
}

// json = { "name":"张三", "age":21 }
```

### 10.细节处理和特殊情况

#### 10.1 请求参数的中文乱码

##### 1. servlet

- tomcat7：
  - get：乱码 pom 插件中配置字符编码集 <uriEncoding>UTF-8</uriEncoding>
  - post：乱码 request.setCharacterEncoding("UTF-8");
- tomcat8+：
  - get：不乱码
  - post：乱码 request.setCharacterEncoding("UTF-8");

##### 2. SpringMVC

将请求响应中文乱码集中统一处理，编写一个字符编码过滤器，SpringMVC 提供了一个请求响应中文乱码处理过滤器，CharacterEncodingFilter

`/src/main/webapp/WEB-INF/web.xml`配置过滤器

```xml
<!--配置SpringMVC提供的中文乱码处理过滤器-->
<filter>
	<filter-name>char</filter-name>
	<filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
	<!--设置初始化参数-->
	<init-param>
		<param-name>encoding</param-name>
		<param-value>UTF-8</param-value>
	</init-param>
	<!--强制请求中文编码处理使用UTF-8-->
  <!--
	<init-param>
		<param-name>forceRequestEncoding</param-name>
		<param-value>true</param-value>
	</init-param>
	-->
	<!--强制响应中文编码处理使用UTF-8-->
  <!--
	<init-param>
		<param-name>forceResponseEncoding</param-name>
		<param-value>true</param-value>
	</init-param>
	-->
</filter>

<filter-mapping>
	<filter-name>char</filter-name>
	<url-pattern>/*</url-pattern>
</filter-mapping>
```

```java
/*
    获取请求参数细节1：请求中文参数乱码
 */
@RequestMapping("/getParams07")
public String getParams07(String name, Integer age){
    System.out.println("==========获取普通请求参数=======");
    System.out.println("name = " + name);
    System.out.println("age = " + age);
    return "success";
}
```

#### 10.2 自定义类型转换器

默认情况下,SpringMVC 已经实现一些数据类型自动转换。 内置转换器全都在：`org.springframework.core.convert.support` 包下 ,如遇特殊类型转换要求，需要我们自己编写自定义类型转换器。

定义一个类，实现 Converter 接口，该接口有两个泛型,S:表示接受的类型， T：表示目标类型(需要转的类型)

```java
package com.zwh.converter;

/*
    自定义日期格式转换器
        1. 定义类，实现接口Converter
            里面有两个泛型： S : 表示的是源数据的类型 ， T： 表示的是目标数据的类型
        2. 实现方法convert
 */
public class DateConverter implements Converter<String , Date> {
    /**
     * @param source 从页面接收到的数据
     * @return 转化出来的日期对象。
     */
    public Date convert(String source) {
        try {
            System.out.println("日期转化器：" + source);
            //1. 定义SimpleDateFormat对象
            SimpleDateFormat sf =null ;
            if(source .contains("-")){
                sf = new SimpleDateFormat("yyyy-MM-dd");
            }else if(source.contains("/")){
                sf = new SimpleDateFormat("yyyy/MM/dd");
            }
            //2. 转化
            return sf.parse(source);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return null;
    }
}
```

- 在 springmvc.xml 里面配置转换器

  spring 配置类型转换器的机制是，将自定义的转换器注册到类型转换服务中去

```xml
			<!--
            5. 配置日期格式转换器
                5.1 配置转换工厂对象
                5.2 给它里面的集合    converters 注入我们自己的类型转换器！
        -->
        <bean id="cs" class="org.springframework.context.support.ConversionServiceFactoryBean">
            <property name="converters">
                <bean class="com.zwh.converter.DateConverter"/>
            </property>
        </bean>
```

## 6.响应数据和视图

### 6.1 响应视图

```java
//1.物理视图
//特点：直观 写起来麻烦
// 注意：当项目中配置了视图解析器之后，物理视图会受视图解析器影响，找不到具体的页面，报404
@RequestMapping("/page01")
public String page01(){
    System.out.println("page01...");
    return "/success.jsp";
}

//2.逻辑视图
// 特点：不直观，写起来简单
// 注意：
//   1.方法返回的字符串，和视图解析器里的前缀、后缀拼接得到真实路径，再进行跳转
//   2. 不管是物理视图（完整的写法）还是逻辑视图（简写），默认采用的都是请求转发跳转
@RequestMapping("/page02")
public String page02(){
    System.out.println("page02...");
    return "success";
}

//3.1：带前缀的物理视图
//注意：让物理视图不受视图解析器影响  forward：转发
@RequestMapping("/page03")
public String page03(){
    System.out.println("page03...");
    return "forward:/success.jsp";
}

//3.2：带前缀的物理视图           redirect：重定向
@RequestMapping("/page04")
public String page04(){
    System.out.println("page04...");
    return "redirect:/success.jsp";
}
```

### 6.2 响应视图和数据

```java
//方式一：创建ModelAndView对象使用
@RequestMapping("/page05")
public ModelAndView page05(){
    System.out.println("page05...");
    //1.创建ModelAndView对象
    ModelAndView mv = new ModelAndView();

    //2.封装Model到mv对象中
    mv.addObject("username","zwh");

    //3.封装View到mv对象中
    mv.setViewName("success");

    //4.返回mv对象
    return mv;
}

//方式二：直接传入ModelAndView对象使用
@RequestMapping("/page06")
public ModelAndView page06(ModelAndView mv){
    System.out.println("page06...");
    //2.封装Model到mv对象中
    mv.addObject("username","zwh");

    //3.封装View到mv对象中
    mv.setViewName("success");

    //4.返回mv对象
    return mv;
}

//方式三：使用Model作为隐式参数传入 存储数据 返回视图名称即可
@RequestMapping("/page07")
public String page07(Model model){
    System.out.println("page07...");

    //1.向Model中存入数据
    model.addAttribute("username","zwh");

    //2.返回视图名称
    return "success";
}
```

### 6.3 响应文本

- 方式一：使用 Servlet 原生 response 对象，返回响应数据 response.getWrite().print("xxxx");
- 方式二：方法上使用@ResponseBody 注解，springmvc 就会把方法的返回值当成字符串来看待，不会再识别成页面的地址路径

```java
//方式一：
@RequestMapping("/page08")
public void page08(HttpServletResponse response) throws IOException {
    System.out.println("page08...");

    response.setContentType("text/html;charset=UTF-8");

    response.getWriter().print("success");
    response.getWriter().print("中文1");
}

//方式二：
@ResponseBody
@RequestMapping("/page09")
public String page09(){
    System.out.println("page09...");
    return "success";
}

//方式二：  produces:设置响应头内容类型  服务器告诉浏览器我给你的内容类型是什么 你应该使用什么字符集进行解码
@ResponseBody
@RequestMapping(value = "/page10",produces = "text/html;charset=UTF-8")
public String page10(){
    System.out.println("page10...");
    return "中文22";
}
```

### 6.4 响应 json 数据

- 方式一：手动将 JavaBean 对象转换成 json 格式的字符串，响应给客户端
- 方式二：方法返回 JavaBean 对象，使用@ResponseBody 注解 Springmvc 帮我们转换成 json 格式。必须先添加`jackson-databind`依赖

```xml
<dependency>
  <groupId>com.fasterxml.jackson.core</groupId>
  <artifactId>jackson-databind</artifactId>
  <version>2.9.6</version>
</dependency>
```

```java
//方式一：
@RequestMapping("/page11")
public void page11(HttpServletResponse response) throws IOException {
    System.out.println("page11...");

    response.setContentType("application/json;charset=UTF-8");

    User user = new User();
    user.setName("张三");
    user.setAge(18);
    user.setBirthday(new Date());

    //将java对象转为json字符串
    ObjectMapper om = new ObjectMapper();
    String jsonStr = om.writeValueAsString(user);

    //响应json字符串
    response.getWriter().print(jsonStr);
}

//方式二：使用@ResponseBody返回java对象转json格式数据
@ResponseBody
@RequestMapping("/page12")
public User page12(){
    System.out.println("page12...");

    User user = new User();
    user.setName("张三");
    user.setAge(18);
    user.setBirthday(new Date());

    return user;
}

//方式二：使用@ResponseBody返回java对象集合转json格式数据响应给前端
@ResponseBody
@RequestMapping("/page13")
public List<User> page13(){
    System.out.println("page12...");

    User user1 = new User();
    user1.setName("张三");
    user1.setAge(18);
    user1.setBirthday(new Date());

    User user2 = new User();
    user2.setName("李四");
    user2.setAge(28);
    user2.setBirthday(new Date());

    List<User> list = new ArrayList<>();
    list.add(user1);
    list.add(user2);

    return list;
}
```

## 7.常用注解

- @RequestParam：获取普通请求参数 设置请求参数和方法形参的绑定

- @RequestBody：获取请求体中的 json 格式数据，赋值给方法形参对象

- @PathVariable：截取请求地址中的部分数据，赋值给方法参数

  - 属性：name|value：设置参数和占位符名称保持一致

  - 使用步骤：

    1.设置请求地址时，使用{}作为占位符 设置占位符参数名称 2.方法形参变量名和占位符参数名称一致 在方法形参前打上@PathVariable 注解 将请求地址中的占位符的数据赋值给方法参数了

- @RequestHeader:获取指定名称请求头的值 赋值给方法参数

  - 属性：
    name|value：设置请求头名称
    required：设置该请求头是否是必须的 默认是 true，如果请求头名称写错，或者获取不到指定的请求头数据 则会报 400 异常
    设置为 false，如果找不到就算了，方法参数就赋值为 null

- @CookieValue：获取指定名称 Cookie 的值 赋值给方法参数

  - 属性：
    name|value：设置 cookie 的名称
    required：默认为 true 获取不到就报错 获取到就正常赋值
    设置为 false 获取不到就算了 参数赋值为 null

```java
@ResponseBody
@RequestMapping("/user/delete/{id}")
public String pathVariable(@PathVariable Integer id) {
    System.out.println("pathVariable... id=" + id);
    return "success";
}

@ResponseBody
@RequestMapping("/getHeader")
public String getHeader(@RequestHeader(value = "User-Agent", required = false) String userAgent) {
    System.out.println("userAgent = " + userAgent);
    return "success";
}

@ResponseBody
@RequestMapping("/getCookie")
public String getCookie(@CookieValue("JSESSIONID") String cookieValue) {
    System.out.println("cookieValue = " + cookieValue);
    return "success";
}
```
