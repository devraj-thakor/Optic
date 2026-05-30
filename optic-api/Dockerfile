FROM php:8.3-cli

# Install system dependencies and Supervisor
RUN apt-get update && apt-get install -y \
    supervisor \
    libpq-dev \
    unzip \
    zip \
    git

# Install PHP extensions for Postgres and Redis
RUN docker-php-ext-install pdo pdo_pgsql
RUN pecl install redis && docker-php-ext-enable redis

# Set working directory
WORKDIR /app

# Copy application files
COPY . /app

# Install Composer and production dependencies
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

# Ensure proper permissions for Laravel logging and caching
RUN chmod -R 777 /app/storage /app/bootstrap/cache

# Hugging Face runtime requires port 7860
EXPOSE 7860

# Add Supervisor configuration file
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Boot application via Supervisor process manager
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]