//
//  WKWebViewController.h
//  TestWkweb
//
//  Created by feng on 16/2/29.
//  Copyright © 2016年 feng. All rights reserved.
//
typedef enum {
    URL_load = 0,
    HTML_load ,
    Data_load ,
    Fiel_load,
}WkwebLoadType;

#import <UIKit/UIKit.h>

@interface WKWebViewController : UIViewController

@property(nonatomic,strong) NSString * Urlload;
@property(nonatomic,strong) NSString * Htmlload;
@property(nonatomic,assign) WkwebLoadType LoadType;


@end

