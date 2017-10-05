<p align="center">
  <img src = "resources/logo.png" alt = "Logo" width = 600 /> 
</p>

## Requirements
Install `npm` and `mongodb` if they are not already installed.
```bash
brew install node
brew install mongodb
mkdir -p /data/db
```
Ensure that user account running mongod has correct permissions for the directory:

```bash
sudo chmod 0755 /data/db
sudo chown $USER /data/db
```

## Installation

```bash
git clone https://github.com/avartanii/CaseX.git
cd CaseX
npm install
```
## Running & Development

Starting Server
```bash
npm start
```
Running Tests
```bash
npm test
```

Linting
```bash
npm run lint
```
