# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set the working directory in the container
RUN mkdir /app
WORKDIR /app

# Copy the requirements.txt file into the container at /app
COPY requirements.txt /app/
COPY start.sh /app/

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
COPY . /app
# COPY ./tools/start.sh /app/start.sh

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Run the Django server
ENTRYPOINT ["sh", "/app/start.sh"]

#CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
