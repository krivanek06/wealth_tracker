package spendmindful.com;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;

import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    registerPlugin(GoogleAuth.class);
  }
}
