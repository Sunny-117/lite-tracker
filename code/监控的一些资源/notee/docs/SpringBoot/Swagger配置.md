# Swagger 配置

## 介绍

Swagger 是一个规范和完整的框架，用于生成、描述、调用和可视化 RESTful 风格的 Web 服务。功能主要包含以下几点:

- 使得前后端分离开发更加方便，有利于团队协作
- 接口文档在线自动生成，降低后端开发人员编写接口文档的负担
- 接口功能测试

使用 Swagger 只需要按照它的规范去定义接口及接口相关的信息，再通过 Swagger 衍生出来的一系列项目和工具，就可以做到生成各种格式的接口文档，以及在线接口调试页面等等。

直接使用 Swagger, 需要按照 Swagger 的规范定义接口, 实际上就是编写 Json 文件，编写起来比较繁琐、并不方便,。而在项目中使用，我们一般会选择一些现成的框架来简化文档的编写，而这些框架是基于 Swagger 的，如 knife4j。knife4j 是为 Java MVC 框架集成 Swagger 生成 Api 文档的增强解决方案。

## 导入 maven 坐标

导入 knife4j 的 maven 坐标

```xml
<dependency>
    <groupId>com.github.xiaoymin</groupId>
    <artifactId>knife4j-spring-boot-starter</artifactId>
    <version>3.0.2</version>
</dependency>
```

## 导入相关配置类

- 配置类中加上两个注解 @EnableSwagger2 @EnableKnife4j ,开启 Swagger 和 Knife4j 的功能。
- 在配置类中声明一个 Docket 类型的 bean, 通过该 bean 来指定生成文档的信息。

```java
@Slf4j
@Configuration
@EnableSwagger2
@EnableKnife4j
public class WebMvcConfig extends WebMvcConfigurationSupport {

    /**
     * 设置静态资源映射
     * @param registry
     */
    @Override
    protected void addResourceHandlers(ResourceHandlerRegistry registry) {
       	registry.addResourceHandler("doc.html").addResourceLocations("classpath:/META-INF/resources/");
        registry.addResourceHandler("/webjars/**").addResourceLocations("classpath:/META-INF/resources/webjars/");
    }


    @Bean
    public Docket createRestApi() {
        // 文档类型
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.fxkj.sms.controller"))
                .paths(PathSelectors.any())
                .build();
    }

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title("外卖平台")
                .version("1.0")
                .description("外卖平台接口文档")
                .build();
    }
}
```

> Docket 声明时，指定的有一个包扫描的路径，该路径指定的是 Controller 所在包的路径。因为 Swagger 在生成接口文档时，就是根据这里指定的包路径，自动的扫描该包下的@Controller， @RestController， @RequestMapping 等 SpringMVC 的注解，依据这些注解来生成对应的接口文档。

> 这里是直接在 WebMvcConfig 配置类中声明

## 设置静态资源映射

由于 Swagger 生成的在线文档中，涉及到很多静态资源，这些静态资源需要添加静态资源映射，否则接口文档页面无法访问。因此需要在 WebMvcConfig 类中的 addResourceHandlers 方法中增加如下配置。

```java
registry.addResourceHandler("doc.html").addResourceLocations("classpath:/META-INF/resources/");
registry.addResourceHandler("/webjars/**").addResourceLocations("classpath:/META-INF/resources/webjars/");
```

## LoginCheckFilter 设置放行

需要将 Swagger 及 Knife4j 相关的静态资源直接放行，无需登录即可访问，否则我们就需要登录之后，才可以访问接口文档的页面。

在原有的不需要处理的请求路径中，再增加如下链接：

```java
private String[] passUrls = {
            "/**/api/**", "/**/images/**", "/**/js/**", "/**/plugins/**", "/**/styles/**",
            "/**/favicon.ico",
            "/**/login.html",
            "/employee/login", "/employee/logout",
            "/user/sendMsg", "/user/login",
            "/doc.html", "/webjars/**", "/swagger-resources", "/v2/api-docs"
    };
```

## 查看接口文档

重新启动项目，访问接口文档，访问链接为： http://localhost:8080/doc.html

> 如果增删改查的方法需要 token 验证，在测试时候，也是需要先访问登录接口。获取 cookie-session 存在本地，才可以再访问其他接口进行测试。

## 常用注解

默认接口文档分类及接口描述都是 Controller 的类名(驼峰命名转换而来)及方法名，而且在接口文档中，所有的请求参数，响应数据，都没有中文的描述，并不知道里面参数的含义，接口文档的可读性很差。

为了解决上述的问题，Swagger 提供了很多的注解，通过这些注解，我们可以更好更清晰的描述我们的接口，包含接口的请求参数、响应数据、数据模型等。核心的注解，主要包含以下几个：

| 注解               | 位置             | 说明                                                            |
| ------------------ | ---------------- | --------------------------------------------------------------- |
| @Api               | 类               | 加载 Controller 类上,表示对类的说明                             |
| @ApiModel          | 类(通常是实体类) | 描述实体类的作用                                                |
| @ApiModelProperty  | 属性             | 描述实体类的属性                                                |
| @ApiOperation      | 方法             | 说明方法的用途、作用                                            |
| @ApiImplicitParams | 方法             | 表示一组参数说明                                                |
| @ApiImplicitParam  | 方法             | 用在@ApiImplicitParams 注解中，指定一个请求参数的各个方面的属性 |

## 注解测试

**1). 实体类**

> 可以通过 @ApiModel , @ApiModelProperty 来描述实体类及属性

```java
@Data
@ApiModel("套餐")
public class Setmeal implements Serializable {
    private static final long serialVersionUID = 1L;
    @ApiModelProperty("主键")
    private Long id;

    //分类id
    @ApiModelProperty("分类id")
    private Long categoryId;

    //套餐名称
    @ApiModelProperty("套餐名称")
    private String name;

    //套餐价格
    @ApiModelProperty("套餐价格")
    private BigDecimal price;
}
```

**2). 响应实体 R**

```java
@Data
@ApiModel("返回结果")
public class R<T> implements Serializable{

    @ApiModelProperty("编码")
    private Integer code; //编码：1成功，0和其它数字为失败

    @ApiModelProperty("错误信息")
    private String msg; //错误信息

    @ApiModelProperty("数据")
    private T data; //数据

    @ApiModelProperty("动态数据")
    private Map map = new HashMap(); //动态数据

	//省略静态方法 ....
}
```

**3). Controller 类及其中的方法**

> 描述 Controller、方法及其方法参数，可以通过注解： @Api， @APIOperation， @ApiImplicitParams, @ApiImplicitParam

```java
@RestController
@RequestMapping("/setmeal")
@Slf4j
@Api(tags = "套餐相关接口")
public class SetmealController {

    @Autowired
    private SetmealService setmealService;
    @Autowired
    private CategoryService categoryService;
    @Autowired
    private SetmealDishService setmealDishService;

    /**
     * 新增套餐
     * @param setmealDto
     * @return
     */
    @PostMapping
    @CacheEvict(value = "setmealCache",allEntries = true)
    @ApiOperation(value = "新增套餐接口")
    public R<String> save(@RequestBody SetmealDto setmealDto){
        //...
    }

    /**
     * 套餐分页查询
     * @param page
     * @param pageSize
     * @param name
     * @return
     */
    @GetMapping("/page")
    @ApiOperation(value = "套餐分页查询接口")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "page",value = "页码",required = true),
            @ApiImplicitParam(name = "pageSize",value = "每页记录数",required = true),
            @ApiImplicitParam(name = "name",value = "套餐名称",required = false)
    })
    public R<Page> page(int page,int pageSize,String name){
        //...
    }

    /**
     * 删除套餐
     * @param ids
     * @return
     */
    @DeleteMapping
    @CacheEvict(value = "setmealCache",allEntries = true)
    @ApiOperation(value = "套餐删除接口")
    public R<String> delete(@RequestParam List<Long> ids){
        //...
    }

    /**
     * 根据条件查询套餐数据
     * @param setmeal
     * @return
     */
    @GetMapping("/list")
    @Cacheable(value = "setmealCache",key = "#setmeal.categoryId + '_' + #setmeal.status")
    @ApiOperation(value = "套餐条件查询接口")
    public R<List<Setmeal>> list(Setmeal setmeal){
        //...
    }
}
```
