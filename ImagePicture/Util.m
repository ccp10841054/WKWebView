//
//  Util.m
//  TestWkweb
//
//  Created by feng on 16/3/2.
//  Copyright © 2016年 feng. All rights reserved.
//

#import "Util.h"

static Util * share = nil;
static id<UserImageClickedDelegate> UserImageSelectFinish = nil;


@implementation Util

+(Util *)getShare{
    
    if (share == nil) {
        share = [[Util alloc] init];
    }
    return share;
}
+(void)releaseShare{
    
    share = nil;
}

- (void)UserImageClicked:(UIViewController*)rootVc delegate:(id<UserImageClickedDelegate>)delegate{
    
    UIAlertController *alertController = [UIAlertController alertControllerWithTitle:@"选择图像" message:nil preferredStyle:UIAlertControllerStyleAlert];
    
    if([UIImagePickerController isSourceTypeAvailable:UIImagePickerControllerSourceTypeCamera]){
        UIAlertAction *cancelAction = [UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:nil];
        UIAlertAction *takephotoAction = [UIAlertAction actionWithTitle:@"拍照" style:UIAlertActionStyleDestructive handler:^(UIAlertAction *action) {
            [self alterAction:rootVc soureType:UIImagePickerControllerSourceTypeCamera];
        }];
        UIAlertAction *fromphotoAction = [UIAlertAction actionWithTitle:@"从相册选择" style:UIAlertActionStyleDefault handler:^(UIAlertAction *action) {
            [self alterAction:rootVc soureType:UIImagePickerControllerSourceTypePhotoLibrary];
        }];
        [alertController addAction:cancelAction];
        [alertController addAction:takephotoAction];
        [alertController addAction:fromphotoAction];
    }
    else{
        UIAlertAction *cancelAction2 = [UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:nil];
        UIAlertAction *actionAssume = [UIAlertAction actionWithTitle:@"拍照" style:UIAlertActionStyleDestructive handler:^(UIAlertAction *action) {
            [self alterAction:rootVc soureType:UIImagePickerControllerSourceTypeCamera];
        }];
        [alertController addAction:cancelAction2];
        [alertController addAction:actionAssume];
    }
    UserImageSelectFinish = delegate;
    [rootVc presentViewController:alertController animated:YES completion:nil];
    
}

-(void)alterAction:(UIViewController*)rootVc soureType:(NSUInteger)sourceType{
 
    UIImagePickerController *imagePickerController = [[UIImagePickerController alloc] init];
    imagePickerController.delegate = self;
    imagePickerController.allowsEditing = YES;
    imagePickerController.sourceType = sourceType;
    [rootVc presentViewController:imagePickerController animated:YES completion:^{}];
}

#pragma mark - image picker delegte
- (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary *)info{
    [picker dismissViewControllerAnimated:YES completion:^{}];
    UIImage *image = [info objectForKey:UIImagePickerControllerOriginalImage];
//    NSData *imageData = UIImageJPEGRepresentation(image, 1.0);
    if (UserImageSelectFinish) {
        [UserImageSelectFinish didFinishPickingUserImage:image];
        UserImageSelectFinish = nil;
    }
}

-(void)uploadImage:(NSData*)data
{
    
}



@end
