package com.dbc;

import android.content.ContentResolver;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.os.PersistableBundle;
import android.provider.MediaStore;
import android.util.Log;

import androidx.annotation.Nullable;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;

import com.calendarevents.CalendarEventsPackage;
import com.facebook.react.ReactActivity;



public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "DBC";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    Log.i("SSs", "oncreate: ");
    Uri data = getIntent().getData();
    if(data != null) {
      try {
        importData(data);
      }catch (Exception e) {
        Log.e("File Import Error", e.getMessage());
      }
    }else{
      Log.i("empty", "dat is null: ");
    }
  }

  @Override
  public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
    CalendarEventsPackage.onRequestPermissionsResult(requestCode, permissions, grantResults);
    super.onRequestPermissionsResult(requestCode, permissions, grantResults);
  }
  @Override
  protected void onResume() {
    super.onResume();
    Log.i("SSs", "importData: ");
    Uri data = getIntent().getData();
    

    if(data != null) {
      try {
        importData(data);
      }catch (Exception e) {
        Log.e("File Import Error", e.getMessage());
      }
    }else{
      Log.i("empty", "dat is null: ");
    }
  }

  private void importData(Uri data) {
    Log.i("SSss", "importData function: ");
    final String scheme = data.getScheme();

    if (ContentResolver.SCHEME_CONTENT.equals(scheme)) {
      try {
        ContentResolver cr = getApplicationContext().getContentResolver();
        InputStream is = cr.openInputStream(data);
        if(is == null) return;

        String name = getContentName(cr, data);

        PackageManager m = getPackageManager();
        String s = getPackageName();
        PackageInfo p = m.getPackageInfo(s, 0);
        s = p.applicationInfo.dataDir;
        Log.i("SSss", name);
        InputStreamToFile(is, s + "/files/" + name);
      } catch (Exception e) {
        Log.e("File Import Error", e.getMessage());
      }
    }
  }

  private String getContentName(ContentResolver resolver, Uri uri){
    Cursor cursor = resolver.query(uri, null, null, null, null);
    cursor.moveToFirst();
    int nameIndex = cursor.getColumnIndex(MediaStore.MediaColumns.DISPLAY_NAME);
    if (nameIndex >= 0) {
      return cursor.getString(nameIndex);
    } else {
      return null;
    }
  }

  private void InputStreamToFile(InputStream in, String file) {
    try {
      OutputStream out = new FileOutputStream(new File(file));

      int size = 0;
      byte[] buffer = new byte[1024];

      while ((size = in.read(buffer)) != -1) {
        out.write(buffer, 0, size);
      }

      out.close();
    }
    catch (Exception e) {
      Log.e("MainActivity", "InputStreamToFile exception: " + e.getMessage());
    }
  }
}



