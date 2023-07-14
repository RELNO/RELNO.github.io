import os
from PIL import Image


def process_images(folder_path):
    # Create "raw" folder if it doesn't exist
    raw_folder = os.path.join(folder_path, "raw")
    os.makedirs(raw_folder, exist_ok=True)

    # Get all file names in the folder
    file_names = os.listdir(folder_path)

    image_counter = 1  # Counter for the new image names

    for file_name in file_names:
        file_path = os.path.join(folder_path, file_name)

        # Check if the file is an image
        if is_image(file_path):
            try:
                # Open the image using PIL
                image = Image.open(file_path)

                # Calculate the resized dimensions while maintaining the aspect ratio
                resized_dimensions = calculate_resized_dimensions(image.size)

                # Resize the image
                resized_image = image.resize(resized_dimensions)

                # Create a new file name for the processed image
                new_file_name = f"{image_counter}.jpg"
                image_counter += 1

                # Save the resized image as JPEG
                resized_image.save(os.path.join(folder_path, new_file_name), "JPEG")

                # Move the original image to the "raw" folder
                os.rename(file_path, os.path.join(raw_folder, file_name))

                print(f"Processed: {file_name}")

            except Exception as e:
                print(f"Error processing {file_name}: {str(e)}")


def is_image(file_path):
    # Check if the file has an image extension
    image_extensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"]
    return any(file_path.lower().endswith(ext) for ext in image_extensions)


def calculate_resized_dimensions(size):
    max_width = 1200
    max_height = 1200

    width, height = size

    # Calculate the resizing factor based on the maximum dimensions
    width_ratio = max_width / width
    height_ratio = max_height / height
    resizing_factor = min(width_ratio, height_ratio)

    # Calculate the new dimensions
    new_width = int(width * resizing_factor)
    new_height = int(height * resizing_factor)

    return new_width, new_height

# Example usage
folder_path = "/Users/noyman/GIT/RELNO.github.io/PRJ/14rbd"
process_images(folder_path)


