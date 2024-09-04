import csv
import random
import string
import requests


def generate_random_name():
    """Generates a random, anonymized name."""
    first_names = [
        "John",
        "Jane",
        "Michael",
        "Emily",
        "Christopher",
        "Olivia",
        "David",
        "Sophia",
        "Matthew",
        "Ava",
    ]
    last_names = [
        "Smith",
        "Johnson",
        "Williams",
        "Brown",
        "Jones",
        "Miller",
        "Davis",
        "Garcia",
        "Wilson",
        "Moore",
    ]
    return f"{random.choice(first_names)} {random.choice(last_names)}"


def generate_user_data():
    """Generates user data dictionary."""
    username = f"test_user_{''.join(random.choices(string.ascii_lowercase + string.digits, k=6))}"
    name = generate_random_name()
    email = f"{name.lower().replace(' ', '_')}@example.com"
    password = "securepassword123"  # Replace with a stronger password generation method
    role = "guardian"
    return {
        "name": name,
        "email": email,
        "username": username,
        "password": password,
        "role": role,
    }


def register_user(user_data, url):
    """Registers a user using POST request."""
    headers = {"Content-Type": "application/json"}
    response = requests.post(url, json=user_data, headers=headers)
    return response


def test_create_user_script(url, number_of_users, output_file="dummy_users.csv"):
    """Generates, registers, and saves user data to CSV."""
    results = []
    for _ in range(number_of_users):
        user_data = generate_user_data()
        response = register_user(user_data, url)
        if response.status_code == 200:
            results.append(
                {
                    "name": user_data["name"],
                    "email": user_data["email"],
                    "username": user_data["username"],
                }
            )
        else:
            results.append(
                {
                    "name": user_data["name"],
                    "email": user_data["email"],
                    "username": user_data["username"],
                    "error": response.text,
                }
            )

    # Write results to CSV
    with open(output_file, "w", newline="") as csvfile:
        fieldnames = ["name", "email", "username", "error"]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(results)

    print(
        f"Successfully registered {len([result for result in results if not 'error' in result])} users. Results saved to {output_file}"
    )


# Replace with your server's URL
url = "http://localhost/auth/register"

# Set the number of users to generate and the output filename
number_of_users = 10

test_create_user_script(url, number_of_users)
