FROM nginx:alpine

# Remove default config if needed
RUN rm /etc/nginx/conf.d/default.conf

# Copy your nginx config
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy prebuilt frontend
COPY dist /usr/share/nginx/html

EXPOSE 80
