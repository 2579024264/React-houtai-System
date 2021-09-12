# 概述：
该项目是通过React脚手架实现的小型的后台管理项目。项目业务逻辑不是很复杂，但里面覆盖到了很多重要的知识点，非常适合初学者。

# 技术栈：
    1.Rect(17.x)
    2.react-redux
    3.antd
    4.axios
    5.react-rouer
    6.ecahrts
# 实现功能
    1.实现用户的登录和退出功能
    2.判断登录用户的角色，设置权限
    3.品类管理：显示商品的分类列表，修改分类的名称，查看子分类，添加分类
    4.商品管理：商品具体信息的显示，关键字搜索商品、添加、修改商品
    5.用户管理：显示用户的具体信息，用户的创建、用户的信息修改，删除
    6.角色管理：用户所属角色管理，不同角色拥有不同的权限。创建角色，设置角色权限
    7.图形图表的显示
    

# 项目制作流程及思考？
## 一、git仓库相关：
### 1.创建一个git仓库  2.在本地初始化项目 git init 3.添加到本地仓库 git add. 4.提交到本地仓库 git commit -m "init app"
## 5.关联远程仓库  git remote add origin https://github.com/zxfjd3g/...git  6.推送到远程仓库 git push origin master
## 7.创建一个分支并转到dev分支下  git checkout -b dev  8.将分支推送到远程仓库 git push origin dev
## 二、基本目录结构
### api: ajax相关  assets:公用资源   components:非路由组件  config:配置  pages：路由组件  utils:工具模块  

## 三、antd组件
### 1.按需引入组件及样式
根据文档需要下载几个包，并进行相应到配置之后就可以实现按需引入组件和样式了
### 2.自定义antd主题
需要下载less less-loader 这两个包，然后在config-overrides配置文件中进行配置
## 四、引入路由
安装路由的插件
react-router-dom
然后在App中进行路由的配置
## 五、重置css样式
可以在github中找到相关的reset样式，将之放在public中的css文件下。在全局中，也就是在index.html中引入该重置样式表

## 六、网络请求封装
在api文件夹上面创建两个文件，ajax.js这个文件用来封装axios,index.js是导出各个请求的方法，是每个请求都相互独立。

## 七、用户数据的存储
当用户登录的时候避免不了的就是要保存用户的信息，保存的方法有两种：1.直接将数据保存给一个文件中的数据变量。但带来的问题是，当页面一旦发生刷新，这种临时变量的值就会消失。
2.使用本地存储的方式，实现用户数据的持久保存。这里使用的是localStorage。封装一个工具文件，其中包括了对localStorage中数据的各种操作方法。这个方法可以自己封装，也已直接调用已经封装好的包，比如这里我们使用的就是store这个包。
3.这样每当页面刷新的时候我们可以直接把localStorage中的数据保存到内存中，也就是memoryUitls中。这样做而不是直接从localStorage直接取的原因是：从内存中获取数据的速度要比从本地获取的数据的速度快很多。这也算是一种优化吧。

## 八、动态生成导航栏，将导航栏要显示的数据放过在一个配置文中
通过更改配置文件，动态的改变导航栏的显示内容。
结果是需要将数据遍历之后显示，遍历可以让数组通过map方法进行遍历，并且在这个过程中判断是否有children属性，从而实现不同的显示。在进行二级遍历的时候最巧妙的方式就是使用递归的方式实现。

## 九、获取天气预报的信息，我们使用的百度地图提供的接口，这里的请求使用的是jsonp的请求方式。
并不直接封装使用jsonp，调用一个jsonp的库。
但是在使用的过程中发现百度的API无法使用，所以在项目中我们使用的是高德地图的API。使用的请求时axios的get请求。
## 十、实现当前时间的更新
在header中要实现当前时间的持续更新，所以我们加了定时器来实现当前时间的动态获取。但是项目中由于用了高德地图，所以获得的时间是天气预报的报到时间。但是代码中是根据百度地图显示的当前时间的逻辑写的。这里只是为了锻炼这种逻辑。
## 十一、分页的实现
1).纯前台分页
    请求获取数据：一次获取所有数据，翻页时不需要再发请求
    请求接口：不需要指定页码(pageNum)和每页数量(pageSize)
    响应数据：所有数据的数组
2).基于后台的分页
    请求获取数据：每次只获取当前页的数据，翻页时要发请求
    请求接口：需要指定页码(pageNum)和每页数量(pageSize)
    响应数据：当前页数据的数组+总记录数(total)
3).如何选择？
    基本根据数据多少来选择，数据多的情况下使用后台分页，数据少的情况下使用前台分页。
## 十二、在父组件中的定义的样式会影响子组件。
## 十三、在react中的如何导入本地的图片
不可以使用常规的导入图片的方式相对路径，绝对路径。这样图片不会显示出来。
解决方法：使用require，import的方式导入图片.
例：1.<img src={require(../../assets/cat.png).default}>
2.import logoImg from '../../assets/cat.png'
<img src={logoImg} alt=""/>


## 十四、当有多个请求，且请求的数据之间没有数据的共享
如果使用多个await方式发多个请求：后面一个请求时前一个请求成功返回之后才发送。
这样带来的问题是：如果await请求足够多，就会浪费大量的时间。解决方法：可以使用Promise.all([]),这个方法，数组里面的请求是同时发起的，只有当所有的请求成功返回之后，才会有返回值。

## 十五、富文本编辑器使用的插件
yarn add react-draft-wysiwyg draftjs-to-html
具体的使用方法在github上寻找使用


## 十六、更新state中的值的方式
不要直接修改状态中的数据，比如state中有一个数据是数组，现在要对数组进行操作：错误做法：
    const items=this.state.array
    items.push(item)
    this.setState({items})
上面的写法很显然是直接操作state中状态的值，正确的写法是：
    const items=[...this.state.array]
    items.push(item)
    this.setState({items})
处了上面的写法，setState中传入函数也可以实现 
    this.setState(state=>({
        array:[...state.array,item]
    }))
使用函数的情况：更新array状态：基于原本状态数据更新


## 十七、使用redux管理状态
需要下载依赖：yarn add redux react-redux redux-thunk redux-devtools-extension
而且当使用redux进行状态管理时，其中一个组件中更改了状态，所有订阅该状态的组件都会进行更新。

## 十八、我们使用BrowserRouter在生产环境下会遇到的一些问题（前后端不独立）
1.在生产环境下我们使用的是BrowserRouter不会访问到正确的页面。
原因：例如现在项目部署到端口为5000的服务端上。如果访问的地址是http://localhost:5000/#/home,此时访问到的就是后台的index.html(打包后的文件)。
如果使用的是BrowseRouter，访问的地址就是http:localhost:5000/home 直接从后台找home这个文件显然是不存在的。也就是说路径后面的path会被当作后台路由路径，去请求对应的后台路由。
解决方法：要解决这个问题关键在于当访问http:localhost:5000/home地址的时候，服务器端要给前台返回index.html这个文件。使用自定义中间件去读取返回index页面展现。

server.js
必须在路由中间件之后声明使用：
app.use((req,res)=>{
    fs.readFile(__dirname + '/public/index.html',(err,data)=>{
        if(err){
            console.log(err)
        }else{
            res.writeHead(200,{
                'Content-Type':'text/html;charset=utf-8
            });
            res.end(data)
        }
    })
})
现在当访问的地址后台没有路由处理的时候就会返回index.html。然后index.html里的js就会通过路由地址找到相应的界面。

需要注意的是：前端路由路径不要于后台路由路径相同。项目中我们给所有的后台请求路径加上api这个前缀保证地址不同。



# 问题：
1.在render中不能直接使用img标签引入图片，正确的做法是在组件的中通过使用import的方式引入变量之后，然后在指定的位置动态引入。
2.现在项目跑在3000端口上，而服务器在5000端口，这显然是一个跨域问题，解决方法有三种：
    jsonp 只解决get请求
    cors  这种是后台允许才能使用
    代理  在前台自己进行配置，也是开发中常用的方法。

3.要在left-nav组件中使用props的location属性，但是left-nav并不是一个路由组件，所以获取不到location属性。
解决方法：使得非路由组件获得三大属性的方法是使用withRouter
4.在auth-form组件中，使用的是PureComponent，但是该组件中的props是一个引用类型role，而且
