# usb-service

USB audio input control service for avsr service

## Installing dependencies

Updating the list of available packages:
```sudo apt update```

Install Python and PortAudio:
```sudo apt install -y python3-dev portaudio19-dev libportaudio2 libportaudiocpp0```
```sudo apt install -y python3 python3-pip```

Installing the Venv virtual environment:
```sudo apt install -y python3.10-venv```

Creating a virtual environment:
```python3 -m venv myenv```

Activate the virtual environment:
```source myenv/bin/activate```

Installing the python dependencies used:
```pip install numpy sounddevice```