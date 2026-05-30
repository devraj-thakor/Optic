FROM php:8.3-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    supervisor \
    libpq-dev \
    unzip \
    zip \
    git

# Install Postgres and Redis drivers
RUN docker-php-ext-install pdo pdo_pgsql
RUN pecl install redis && docker-php-ext-enable redis

# Set the working directory
WORKDIR /app

# THIS IS THE MAGIC LINE: 
# It copies only your Laravel backend into the container, ignoring the frontend
COPY optic-api/ /app/

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

# Set permissions
RUN chmod -R 777 /app/storage /app/bootstrap/cache

# Expose Hugging Face Port
EXPOSE 7860

# Copy the supervisor config from the subfolder
COPY optic-api/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Boot
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]