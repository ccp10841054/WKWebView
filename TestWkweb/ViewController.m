//
//  ViewController.m
//  TestWkweb
//
//  Created by feng on 16/2/29.
//  Copyright © 2016年 feng. All rights reserved.
//



#import "ViewController.h"
#import "WKWebViewController.h"
#import "Util.h"

@interface ViewController ()<UserImageClickedDelegate>
{
    
    __weak IBOutlet UIImageView *userImageView;
}

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    }

-(void)viewWillAppear:(BOOL)animated
{
        [super viewWillAppear:animated];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
}
- (IBAction)buttonActionLoadUrl:(id)sender {
    
    WKWebViewController * webview = [[WKWebViewController alloc]init];
    webview.LoadType = URL_load;
    webview.Urlload = @"http://www.baidu.com";
    [self.navigationController pushViewController:webview animated:YES];
}

- (IBAction)buttonActionLoadhtml:(id)sender {
    
//    WKWebViewController * webview = [[WKWebViewController alloc]init];
//    webview.LoadType = HTML_load;
//    webview.Htmlload = @"/web_app/record.html?host=http://192.168.0.113&port=80&ssl=0&user=admin&pwd=&lng=&sys=1";
//    [self.navigationController pushViewController:webview animated:YES];
    [[Util getShare]UserImageClicked:self delegate:self];
}


#pragma mark UserImageClickedDelegate

-(void)didFinishPickingUserImage:(UIImage *)image{
    userImageView.image = image;
}

@end
