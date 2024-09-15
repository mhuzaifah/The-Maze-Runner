package com.mhuzaifah.themazerunner;

import java.util.List;

public class UserInput {

    private String mode;
    private String maze;
    private String method;
    private String pathToVerify;
    private List<List<Boolean>> mazeArr;

    UserInput() {}

    public String getMaze() {
        return this.maze;
    }

    public String getMethod() {
        return this.method;
    }

    public Object getMode() {
        return this.mode;
    }

    public String getPathToVerify() {
        return this.pathToVerify;
    }

    public List<List<Boolean>> getMazeArr() { return this.mazeArr; }
}
