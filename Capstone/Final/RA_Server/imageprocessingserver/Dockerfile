FROM ubuntu:latest
# Install system packages

COPY . .

ENV PORT=8485
EXPOSE ${PORT}

RUN apt-get update && apt-get install -y --no-install-recommends \
      bzip2 \
      python-pip \
      curl \
      g++ \
      gcc \
      make \
      git \
      libgtk2.0-dev \
      graphviz \
      libgl1-mesa-glx \
      libhdf5-dev \
      openmpi-bin \
      wget && \
    rm -rf /var/lib/apt/lists/*

# Install conda
ENV CONDA_DIR /opt/conda
ENV PATH $CONDA_DIR/bin:$PATH

RUN wget --quiet --no-check-certificate https://repo.continuum.io/miniconda/Miniconda3-4.2.12-Linux-x86_64.sh && \
    echo "c59b3dd3cad550ac7596e0d599b91e75d88826db132e4146030ef471bb434e9a *Miniconda3-4.2.12-Linux-x86_64.sh" | sha256sum -c - && \
    /bin/bash /Miniconda3-4.2.12-Linux-x86_64.sh -f -b -p $CONDA_DIR && \
    rm Miniconda3-4.2.12-Linux-x86_64.sh && \
    echo export PATH=$CONDA_DIR/bin:'$PATH' > /etc/profile.d/conda.sh

RUN conda install -c conda-forge tensorflow
RUN conda install -c conda-forge keras 
RUN conda install -c menpo opencv
RUN conda install -c anaconda scikit-image

RUN pip install absl-py
RUN pip install numpy
RUN pip install ipython
RUN pip install Cython
