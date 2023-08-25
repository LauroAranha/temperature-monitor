# Use an official PHP runtime as the base image
FROM php:7.4-apache

# Set the working directory in the container
WORKDIR /var/www/html

# Install the MySQLi extension
RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli

# Copy your PHP project files into the container
COPY public_html/ /var/www/html/

# Expose port 80 to allow external access
EXPOSE 80

# Start the Apache web server
CMD ["apache2-foreground"]
