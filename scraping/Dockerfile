FROM apache/airflow:2.10.0

# On passe en root pour s'assurer des droits sur le dossier de travail
USER root
RUN chown -R airflow: /opt/airflow

# On repasse sur l'utilisateur airflow
USER airflow

RUN pip install --no-cache-dir \
    beautifulsoup4 \
    requests \
    pymongo \
    apache-airflow-providers-mongo