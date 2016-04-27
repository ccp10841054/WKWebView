//
//  Util.h
//  TestWkweb
//
//  Created by feng on 16/3/2.
//  Copyright © 2016年 feng. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>



@protocol UserImageClickedDelegate

-(void)didFinishPickingUserImage:(UIImage *)image;

@end

@interface Util : NSObject<UINavigationControllerDelegate, UIImagePickerControllerDelegate>

+(Util*)getShare;
+(void)releaseShare;

- (void)UserImageClicked:(UIViewController*)rootVc delegate:(id<UserImageClickedDelegate>)delegate;
@end
