# servlet 中 cookie 和 session 的方法

## 1.1 设置 cookie

```java
Cookie cookie = new Cookie("name", "zwh");
resp.addCookie(cookie);


// 如果值可能包含中文,需要对值进行URL编码(英文用encode输出同样的值)
Cookie cookie2 = new Cookie("name2", URLEncoder.encode("文华", "utf-8"));
resp.addCookie(cookie2);
```

> 1.`key`和`value`只能是字符串
>
> 2.同一个`key`添加多个值会覆盖
>
> `tomcat8.5`以后会自动对`cookie`值的中文进行 URL 转码,编码和解码阶段都不需要手动了

## 1.2 获取 cookie

由于只会传过来一个`cookie`请求头,所有的`cookie`都是包装在一个值中的,所以获取到的`cookies`需要遍历

```java
Cookie[] cookies = req.getCookies();

if (cookies != null) {
  for (Cookie cookie : cookies) {
    String name = cookie.getName();
    String value = URLDecoder.decode(cookie.getValue());
    System.out.println(name + "=" + value);
  }
}
```

> 有可能客户端没有传 cookie,遍历前必须先判断, 防止空指针异常!
>
> 英文用 decode 输出同样的值

### 1.3 设置存活时间

```java
Cookie cookie = new Cookie("name", "zwh");
cookie.setMaxAge(60);
resp.addCookie(cookie);
```

> setMaxAge(): 参数表示时间单位，单位是秒
>
> a. 参数是正数 ,表示保存在硬盘上，过期后浏览器会清除
> b. 参数是负数,表示只保留在浏览器的内存中,浏览器关闭即清除(默认-1)
> c. 参数是 0,表示要删除这个 cookie(会设置有效期是 1970 年 1 月 1 日 )

## 2.1 设置 session

`servlet`的`session`是基于`cookie`的,`req.getSession()`如果会话有携带`key`为`JSESSIONID`的`cookie`,则根据`id`获取该`session`.如果没携带`JSESSIONID`,则会创建一个新的`session`,并在此次`resq`中设置`key`为`JSESSIONID`的`cookie`

```java
//获取session对象
HttpSession session = req.getSession();
session.setAttribute("name", "朱文华");
```

> `key`必须为`string`,`value`是`object`类型

## 2.2 获取 session

```java
//获取session对象
HttpSession session = req.getSession();

String value = (String) session.getAttribute("name");

System.out.println("sessionServlet02-value = " + value);
```

> 如果`key`没有设置过`session`，返回值是 null

## 2.3 删除 session

```java
//获取session对象
HttpSession session = req.getSession();

//删除单个session
session.removeAttribute("name");

//内存直接释放掉,里面什么数据都没有了
session.invalidate();
```

## 3. session 的钝化和活化

钝化：在服务器正常关闭后，`Tomcat`会自动将`Session`数据写入硬盘的文件中

> Tomcat\target 的 `SESSIONS.ser` 文件

活化：再次启动服务器后，从文件中加载数据到 Session 中

> 数据加载到 Session 中后，路径中的`SESSIONS.ser`文件会被删除掉
