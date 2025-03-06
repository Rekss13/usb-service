# usb-service
USB audio input control service for avsr service

## Installing dependencies
Updating the list of available packages:\
```sudo apt update```

Install Python and PortAudio:\
```sudo apt install -y python3-dev portaudio19-dev libportaudio2 libportaudiocpp0```\
```sudo apt install -y python3 python3-pip```

Installing the Venv virtual environment:\
```sudo apt install -y python3.10-venv```

Creating a virtual environment:\
```python3 -m venv myenv```

Activate the virtual environment:\
```source myenv/bin/activate```

Installing the python dependencies used:\
```pip install numpy sounddevice```

##Improvements

To be able to adjust the volume level of the incoming signal, you need to add the following to **/etc/asound.conf**:
```
pcm.mic_hw {
    type hw
    card 1
    channels 2
    format S16_LE
}
pcm.mic_sv {
    type softvol
    slave.pcm mic_hw
    control {
        name "Boost Capture Volume"
        card 1
    }
    min_dB -3.0
    max_dB 50.0
}
```

To be able to equalize the output sound in the **/etc/asound.conf** file, you need to add the *equal* section.

In order for the output sound to be mixed with other sounds, the equalizer plugin needs to output the sound to *dmixer*:
```
pcm.plugequal {
        type equal;
        slave.pcm "plug:dmixer";
}
```

After adding the ability to amplify the input signal, you can query the current volume:\
```sudo amixer -c 1 sget 'Boost'```

Example of use:
```
$ sudo amixer -c 1 sget 'Boost'
Simple mixer control 'Boost',0
  Capabilities: cvolume
  Capture channels: Front Left - Front Right
  Limits: Capture 0 - 255
  Front Left: Capture 14 [5%] [-0.20dB]
  Front Right: Capture 14 [5%] [-0.20dB]
```

You can change the current volume of the incoming signal:\
```sudo amixer -c 1 sset 'Boost' 10%```

The volume boost feature does not work with all sound cards, and even if it does, it does not always work without errors when the script is activated.
ALSA - 😞