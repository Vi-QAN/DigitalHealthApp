FROM nginx

RUN rm /etc/nginx/nginx.conf

COPY ./nginx.conf /etc/nginx/
# # Install nginx and certbot
# RUN apt-get update && \
#     apt-get install -y nginx certbot python3-certbot-nginx && \
#     rm -rf /var/lib/apt/lists/*

# # # Set current working directory
# WORKDIR /etc/nginx

# #
# RUN mkdir /etc/nginx/certbot

# # Remove default conf (Optional)
# RUN rm ./nginx.conf

# # Copy nginx configuration from host
# COPY ./nginx.conf .

# # Obtain certificates
# RUN certbot certonly --nginx \
#     --agree-tos \
#     --non-interactive \
#     -m supertrikas123@gmail.com \
#     --cert-name digitalhealth \
#     --cert-path /etc/nginx/certbot \
#     --key-path /etc/nginx/certbot \
#     -d attractionscanner.link



# Expose ports (Optional)
# EXPOSE 80 443

# Run nginx (Optional)
# CMD ["nginx", "-g", "daemon off;"]
