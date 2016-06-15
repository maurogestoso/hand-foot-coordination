/*CONTOLLER CODE FOR THE HAND FOOT CO-ORDINATION AWKWARD ARCADE CABINET*/

#include "Keyboard.h";

int hand = 13;
int foot = 12;
int handKey = 0xD8;
int footKey = 0xD7;

void setup() {
  pinMode(hand, INPUT);
  pinMode(foot, INPUT);
  Keyboard.begin();
}

void loop() {
  if (digitalRead(hand)) {
    Keyboard.press(handKey);
  }
  else {
    Keyboard.release(handKey);
  }
  if (digitalRead(foot)){
    Keyboard.press(footKey);
  }
  else {
    Keyboard.release(footKey);
  }
}
