//
//  WKWebViewController.m
//  TestWkweb
//
//  Created by feng on 16/2/29.
//  Copyright © 2016年 feng. All rights reserved.
//

#import "WKWebViewController.h"
#import <WebKit/WKWebView.h>
#import <WebKit/WebKit.h>

@interface WKWebViewController ()<WKNavigationDelegate,WKUIDelegate>

//创建一个实体变量
@property(nonatomic,strong) WKWebView * ZSJ_WkwebView;
// 加载type
@property(nonatomic,assign) NSInteger  IntegerType;
// 设置加载进度条
@property(nonatomic,strong) UIProgressView *  ProgressView;

@end

@implementation WKWebViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    /*
     *创建进度
     */
    if (!self.ProgressView) {
        self.ProgressView = [[UIProgressView alloc]initWithProgressViewStyle:UIProgressViewStyleDefault];
        self.ProgressView.frame = CGRectMake(0, 64, self.view.bounds.size.width, 2);
        // 设置进度条的色彩
        [self.ProgressView setTrackTintColor:[UIColor darkGrayColor]];
        self.ProgressView.progressTintColor = [UIColor redColor];
        [self.view addSubview:self.ProgressView];
    }
    /*
     *初始化webview
     */
    if (!self.ZSJ_WkwebView) {
        //设置网页的配置文件
        WKWebViewConfiguration * Configuration = [[WKWebViewConfiguration alloc]init];
        //允许视频播放
        Configuration.allowsAirPlayForMediaPlayback = YES;
        // 允许在线播放
        Configuration.allowsInlineMediaPlayback = YES;
        // 允许可以与网页交互，选择视图
        Configuration.selectionGranularity = YES;
        //创建更改数据源
        NSString * JS = [NSString stringWithFormat:@"loadDetail(\"%d\")",70];
        WKUserScript * script = [[WKUserScript alloc] initWithSource:JS injectionTime:WKUserScriptInjectionTimeAtDocumentEnd forMainFrameOnly:YES];
        WKUserContentController * UserContentController = [[WKUserContentController alloc]init];
        [UserContentController addUserScript:script];
        // 是否支持记忆读取
        Configuration.suppressesIncrementalRendering = YES;
        // 允许用户更改网页的设置
        Configuration.userContentController = UserContentController;
        self.ZSJ_WkwebView = [[WKWebView alloc]initWithFrame:CGRectMake(0, 66, self.view.bounds.size.width, self.view.bounds.size.height -110) configuration:Configuration];
        self.ZSJ_WkwebView.backgroundColor = [UIColor colorWithRed:240.0/255 green:240.0/255 blue:240.0/255 alpha:1.0];
        // 设置代理
        self.ZSJ_WkwebView.navigationDelegate = self;
        self.ZSJ_WkwebView.UIDelegate = self;
        /* 添加进度监控
        kvo 键值观察
         NSKeyValueObservingOptionNew 把更改之前的值提供给处理方法
         
         　　NSKeyValueObservingOptionOld 把更改之后的值提供给处理方法
         
         　　NSKeyValueObservingOptionInitial 把初始化的值提供给处理方法，一旦注册，立马就会调用一次。通常它会带有新值，而不会带有旧值。
         
         　　NSKeyValueObservingOptionPrior 分2次调用。在值改变之前和值改变之后。
         
         */
        [self.ZSJ_WkwebView addObserver:self forKeyPath:@"estimatedProgress" options:NSKeyValueObservingOptionNew context:nil];
        [self.ZSJ_WkwebView addObserver:self forKeyPath:@"title" options:NSKeyValueObservingOptionNew context:nil];
        
        //开启手势触摸
        self.ZSJ_WkwebView.allowsBackForwardNavigationGestures = YES;
        // 设置 可以前进 和 后退
        //适应你设定的尺寸
        [self.ZSJ_WkwebView sizeToFit];
        //选择加载方式
        [self loadinteger:self.LoadType];
        //添加到主控制器上
        [self.view addSubview:self.ZSJ_WkwebView];
        [self addFactionButoon];
        
    }
    // Do any additional setup after loading the view, typically from a nib.
}
-(void)addFactionButoon{
    UIView * Buttonview = [[UIView alloc]initWithFrame:CGRectMake(0, self.view.bounds.size.height - 44, self.view.bounds.size.width, 44)];
    Buttonview.backgroundColor = [UIColor colorWithRed:137.0/255 green:137.0/255 blue:137.0/255 alpha:0.5];
    [self.view addSubview:Buttonview];
    for (int i= 0 ; i<3; i ++) {
        
        UIButton * button = [UIButton buttonWithType:UIButtonTypeCustom];
        button.frame = CGRectMake(40+i*(self.view.bounds.size.width)/2-(i+1)*30, self.view.bounds.size.height - 42, 40, 40);
        [button addTarget:self action:@selector(ClicK:) forControlEvents:UIControlEventTouchUpInside];
        button.tag = i;
        [button setImage:[UIImage imageNamed:[NSString stringWithFormat:@"WKButtonAction%d.png",i]] forState:UIControlStateNormal];
        [self.view addSubview:button];
    }
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

#pragma mark button action
-(void)ClicK:(UIButton *)Btn{
    switch (Btn.tag) {
        case 0:{
            //这个是带缓存的验证
            //            [self.ZSJ_WkwebView reloadFromOrigin];
            // 是不带缓存的验证，刷新当前页面
            [self.ZSJ_WkwebView reload];
        }
            break;
        case 1:{
            /* 后退
            *首先判断网页是否可以后
            */
            if (self.ZSJ_WkwebView.canGoBack) {
                [self.ZSJ_WkwebView goBack];
            }
        }
            break;
        case 2:{
            /*前进
            判断是否可以前进
             */
            if (self.ZSJ_WkwebView.canGoForward) {
                [self.ZSJ_WkwebView goForward];
            }
        }
            break;
        case 3:{
            //进行跳转,我们设置跳转的返回到第一个界面
            NSLog(@"%@",self.ZSJ_WkwebView.backForwardList.backList);
            if (self.ZSJ_WkwebView.backForwardList.backList.count >2) {
                [self.ZSJ_WkwebView goToBackForwardListItem:self.ZSJ_WkwebView.backForwardList.backList[0]];
                
            }            
            
        }
            break;
        default:
            break;
    }
}
#pragma mark  loadRequest type action
-(void)loadinteger:(NSInteger)integer{
    switch (integer) {
        case 0:{
            //创建一个NSURLRequest 的对象
            NSURLRequest * Request_zsj = [NSURLRequest requestWithURL:[NSURL URLWithString:self.Urlload]];
            
            //加载网页
            
            [self.ZSJ_WkwebView loadRequest:Request_zsj];
        }
            break;
        case 1:{
            NSLog(@"self.Htmlload = %@",self.Htmlload);
            NSString *resourcePath = [ [NSBundle mainBundle] resourcePath];
            NSString *filePath = [resourcePath stringByAppendingPathComponent:self.Htmlload];
//            NSString *htmlstring =[[NSString alloc] initWithContentsOfFile:filePath encoding:NSUTF8StringEncoding error:nil];
            [self.ZSJ_WkwebView loadHTMLString:filePath baseURL:[NSURL URLWithString:[[NSBundle mainBundle] bundlePath]]];
        }
            break;
        case 2:{
            
        }
            break;
        case 3:{
            
        }
            break;
            
        default:
            break;
    }
}

#pragma mark WKNavigationDelegate
//这个是网页加载完成，导航的变化
-(void)webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation{
    
    /*
     主意：这个方法是当网页的内容全部显示（网页内的所有图片必须都正常显示）的时候调用（不是出现的时候就调用），，否则不显示，或则部分显示时这个方法就不调用。
     */
    NSLog(@"加载完成调用");
    // 获取加载网页的标题
    self.title = self.ZSJ_WkwebView.title;
    
}
//开始加载
-(void)webView:(WKWebView *)webView didStartProvisionalNavigation:(WKNavigation *)navigation{
    //开始加载的时候，让加载进度条显示
    self.ProgressView.hidden = NO;
    NSLog(@"开始加载的时候调用。。");
    NSLog(@"%lf",   self.ZSJ_WkwebView.estimatedProgress);
    
}
//内容返回时调用
-(void)webView:(WKWebView *)webView didCommitNavigation:(WKNavigation *)navigation{
    NSLog(@"当内容返回的时候调用");
    NSLog(@"%lf",   self.ZSJ_WkwebView.estimatedProgress);
    
}
-(void)webView:(WKWebView *)webView didReceiveServerRedirectForProvisionalNavigation:(WKNavigation *)navigation{
    NSLog(@"这是服务器请求跳转的时候调用");
}
-(void)webView:(WKWebView *)webView didFailProvisionalNavigation:(WKNavigation *)navigation withError:(NSError *)error{
    // 内容加载失败时候调用
    NSLog(@"这是加载失败时候调用");
    NSLog(@"%@",error);
}
-(void)webView:(WKWebView *)webView didFailNavigation:(WKNavigation *)navigation withError:(NSError *)error{
    NSLog(@"通过导航跳转失败的时候调用");
}
-(void)webViewWebContentProcessDidTerminate:(WKWebView *)webView{
    NSLog(@"%lf",   webView.estimatedProgress);
    
}

#pragma mark WKUIDelegate
-(void)webViewDidClose:(WKWebView *)webView{
    NSLog(@"网页关闭的时候调用");
}
-(void)webView:(WKWebView *)webView runJavaScriptAlertPanelWithMessage:(NSString *)message initiatedByFrame:(WKFrameInfo *)frame completionHandler:(void (^)(void))completionHandler{
    // 获取js 里面的提示
}
-(void)webView:(WKWebView *)webView runJavaScriptConfirmPanelWithMessage:(NSString *)message initiatedByFrame:(WKFrameInfo *)frame completionHandler:(void (^)(BOOL))completionHandler{
    // js 信息的交流
}
-(void)webView:(WKWebView *)webView runJavaScriptTextInputPanelWithPrompt:(NSString *)prompt defaultText:(NSString *)defaultText initiatedByFrame:(WKFrameInfo *)frame completionHandler:(void (^)(NSString * _Nullable))completionHandler{
    // 交互。可输入的文本。
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context {
    
    if ([keyPath isEqualToString:@"estimatedProgress"]) {
        if (object == self.ZSJ_WkwebView) {
            NSLog(@"进度信息：%lf",self.ZSJ_WkwebView.estimatedProgress);
            self.ProgressView.progress = self.ZSJ_WkwebView.estimatedProgress;
            if (self.ZSJ_WkwebView.estimatedProgress == 1.0) {
                dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1.0f * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                    self.ProgressView.hidden = YES;
                });
            }
        }
        else{
            [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
        }
    }
    else if ([keyPath isEqualToString:@"title"])
    {
        if (object == self.ZSJ_WkwebView) {
//            self.title = self.ZSJ_WkwebView.title;
            
        }
        else
        {
            [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
        }
    }
    else {
        
        [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
    }
}

//注意，观察的移除
-(void)dealloc{
    [self.ZSJ_WkwebView removeObserver:self forKeyPath:@"estimatedProgress"];
    [self.ZSJ_WkwebView removeObserver:self forKeyPath:@"title"];
}

@end

