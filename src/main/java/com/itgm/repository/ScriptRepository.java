package com.itgm.repository;

import com.itgm.domain.Script;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Script entity.
 */
@SuppressWarnings("unused")
public interface ScriptRepository extends JpaRepository<Script,Long> {

}
