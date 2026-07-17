'''
Title: Image Scaling and Cropping

Description:
This code allows you to scale and crop an image based on a specified size. The user is prompted to enter the filename (without the file extension) of the image they want to process. The code opens the image, resizes it while maintaining the aspect ratio, crops it to a square region, and saves the cropped image as "0.jpg" in the specified folder path. The image is saved in JPEG format.

Usage:
1. Ensure you have Python and the required dependencies (PIL) installed.
2. Prepare the image file you want to process. It should be in JPEG format.
3. Update the `folder_path` variable in the code to specify the folder path where the image is located.
4. Run the code.
5. Enter the filename (without the file extension) of the image when prompted.
6. The code will scale and crop the image, and save the cropped image as "0.jpg" in the specified folder path.

'''

import os
from PIL import Image


def scale_and_crop_image(folder_path, size):
    # first check if the folder path exists
    if not os.path.exists(folder_path):
        print(f"Folder path '{folder_path}' does not exist.")
        return
    #  if so ask the user if they want to continue
    proceed = input(
        f"Proceed with scaling and cropping images in folder path '{folder_path}'? (y/n): ")
    if proceed.lower() != 'y':
        print("Operation cancelled.")
        return

    try:
        # Get the filename from the user
        file_name = input(
            "Enter the filename of the image (without extension) to crop and scale: ")
        image_path = os.path.join(folder_path, f"{file_name}.jpg")

        # Open the image using PIL
        image = Image.open(image_path)

        # Calculate the scale factor based on the minimum dimension
        min_dimension = min(image.size)
        scale_factor = size[0] / min_dimension

        # Calculate the new dimensions after scaling
        new_width = int(image.width * scale_factor)
        new_height = int(image.height * scale_factor)

        # Resize the image to the new dimensions while maintaining the aspect ratio
        resized_image = image.resize((new_width, new_height))

        # Calculate the coordinates for cropping a square region
        left = (resized_image.width - size[0]) // 2
        top = (resized_image.height - size[1]) // 2
        right = left + size[0]
        bottom = top + size[1]

        # Crop the square region
        cropped_image = resized_image.crop((left, top, right, bottom))

        # Save the cropped image as JPEG with filename "0.jpg"
        cropped_image.save(os.path.join(folder_path, "0.jpg"), "JPEG")

        print("Image cropped and scaled successfully.")

    except Exception as e:
        print(f"Error cropping and scaling image: {str(e)}")


folder_path = "/Users/noyman/GIT/RELNO.github.io/projects/09telaviv"
scale_and_crop_image(folder_path, (400, 400))
