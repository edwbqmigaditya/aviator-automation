import pymysql
import sqlalchemy
from google.cloud import bigquery
from sqlalchemy.exc import SQLAlchemyError
from google.cloud.sql.connector import Connector
from mysql.connector import Error

# Initialize Connector object
connector = Connector()

# Function to return the database connection
def getconn() -> pymysql.connections.Connection:
    try:
        conn: pymysql.connections.Connection = connector.connect(
            "geu-ip-edw-migration-day0:us-central1:aviator-mysql",
            "pymysql",
            user="root",
            password="aviator",
            db="aviator"
        )
        db_Info = conn.get_server_info()
        print("Connected to MySQL Server version ", db_Info)
    except Error as e:
        print("Error while connecting to MySQL", e)
    return conn

# Create a SQLAlchemy engine using the creator function
engine = sqlalchemy.create_engine("mysql+pymysql://", creator=getconn)

def truncate_tables():
    connection = engine.connect()
    
    table_names = [
        "AssessmentInfo",
        "DataTransferInfo",
        "InfraDeploymentInfo",
        "Job",
        "LoginInfo",
        "Modernization_Info",
        "PII_Report",
        "SQLMigrationInfo",
        "SchemaTranslationInfo",
    ]

    try:
        for table_name in table_names:
            query = f"TRUNCATE TABLE {table_name};"
            connection.execute(query)

        return {"message": "All Tables Truncated"}
    except SQLAlchemyError as e:
        return {"message": f"Error truncating tables: {e}"}

# Call the truncate_tables function
result = truncate_tables()
print(result)

def drop_tables_in_dataset(project_id, dataset_id):
    # Initialize the BigQuery client
    client = bigquery.Client(project=project_id)

    # Generate SQL query to list tables in the dataset
    query = f"""
    SELECT table_name
    FROM {project_id}.{dataset_id}.INFORMATION_SCHEMA.TABLES
    WHERE table_type = 'BASE TABLE'
    """

    # Execute the query
    query_job = client.query(query)

    # Fetch the results
    results = query_job.result()

    # Construct a list of table names
    table_names = [row.table_name for row in results]

    # Construct and execute DROP TABLE statements
    for table_name in table_names:
        drop_query = f"DROP TABLE {project_id}.{dataset_id}.{table_name}"
        try:
            client.query(drop_query)
            print(f"Table {table_name} dropped successfully.")
        except Exception as e:
            print(f"Error dropping table {table_name}: {e}")

# Set your project ID and dataset IDs
project_id = "geu-ip-edw-migration-day0"
datasets_to_drop = ["insurance", "retail"]


# Call the function to drop tables in each dataset
for dataset_id in datasets_to_drop:
    drop_tables_in_dataset(project_id, dataset_id)