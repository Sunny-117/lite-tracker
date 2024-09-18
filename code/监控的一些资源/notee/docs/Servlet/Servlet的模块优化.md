# Servlet 的模块优化

一个模块写在同一个`servlet`中

## 方式一

1. 截取 `uri` 中和方法名称一致的请求路径

2. 通过 `if...else` 执行对应的方法

```java
//  ------ BrandServlet.java -----

@WebServlet("/brand/*")
public class BrandServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response){
        //1.截取出和方法名称一致的请求路径
        String uri = request.getRequestURI();   // /brand/add
        String methodName = uri.substring(uri.lastIndexOf("/") + 1);    // add
        System.out.println("methodName = " + methodName);

        //2.根据请求路径和方法名进行判断调用指定的方法
        if ("selectAll".equals(methodName)) {
            selectAll(request, response);
        } else if ("add".equals(methodName)) {
            add(request, response);
        }
    }

    //查询所有
    public void selectAll(HttpServletRequest request, HttpServletResponse response){}

    //新增品牌
    public void add(HttpServletRequest request, HttpServletResponse response){}

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response){
        doPost(request, response);
    }
}
```

## 方式二

1. 截取 `uri` 中和方法名称一致的请求路径

2. 通过利用反射获取方法对象
3. `invoke`执行对应的方法对象

```java
//  ------ BrandServlet.java -----

@WebServlet("/brand/*")
public class BrandServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) {
        //1.截取出和方法名称一致的请求路径
        String uri = request.getRequestURI();   // /brand/add
        String methodName = uri.substring(uri.lastIndexOf("/") + 1);    // add
        System.out.println("methodName = " + methodName);

        try {
            //2.利用反射获取方法对象（方法名，参数的类型 class）
            Method method = this.getClass().getDeclaredMethod(methodName, HttpServletRequest.class, HttpServletResponse.class);

            //3.调用方法（方法所在类的对象，参数...）
            method.invoke(this, request, response);
        }catch (Exception e) {
            System.err.println("没有找到指定的方法！！！");
            e.printStackTrace();
        }
    }

    //查询所有
    public void selectAll(HttpServletRequest request, HttpServletResponse response){}

    //新增品牌
    public void add(HttpServletRequest request, HttpServletResponse response){}

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response){
        doPost(request, response);
    }
}
```

## 方式三(推荐)

在方式二的基础上提取父类，解决 `doPost`、`doGet`代码冗余的问题

1. `BaseServlet extends HttpServlet`
2. `BrandServlet extends BaseServlet`

```java
//  ------ BaseServlet.java -----

public class BaseServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) {
        //1.截取出和方法名称一致的请求路径
        String uri = request.getRequestURI();   // /brand/add
        String methodName = uri.substring(uri.lastIndexOf("/") + 1);    // add
        System.out.println("methodName = " + methodName);

        try {
            //2.利用反射获取方法对象（方法名，参数的类型 class）
            Method method = this.getClass().getDeclaredMethod(methodName, HttpServletRequest.class, HttpServletResponse.class);

            //3.调用方法（方法所在类的对象，参数...）
            method.invoke(this, request, response);
        }catch (Exception e) {
            System.err.println("没有找到指定的方法！！！");
            e.printStackTrace();
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response){
        doPost(request, response);
    }
}
```

```java
//  ------ BrandServlet.java -----

@WebServlet("/brand/*")
public class BrandServlet extends BaseServlet {

    //查询所有
    public void selectAll(HttpServletRequest request, HttpServletResponse response){}

    //新增品牌
    public void add(HttpServletRequest request, HttpServletResponse response){}

}
```
