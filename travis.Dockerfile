FROM node:12.13-stretch

RUN apt update && apt upgrade -y -qq && \
  git clone https://github.com/magnumripper/JohnTheRipper /opt/jtr && \
  cd /opt/jtr/src && ./configure && make && \
  echo "#Password" >> /opt/jtr/wordlist.txt

ENV JTR_EXECUTABLE=/opt/jtr/run/john