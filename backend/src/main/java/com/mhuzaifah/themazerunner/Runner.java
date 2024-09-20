package com.mhuzaifah.themazerunner;

import java.util.ArrayDeque;
import java.util.Queue;

public class Runner {

    private Queue<Position> runSequence;

    Runner() {
        this.runSequence = new ArrayDeque<>();
    }

    public void addToRunSequence(Position pos) {
        this.runSequence.add(pos);
    }

    public Queue<Position> getRunSequence() {
        return this.runSequence;
    }

}
